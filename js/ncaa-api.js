const NCAA_BASE_URL = 'https://ncaa-api.henrygd.me';

let collegesRequest = null;
let collegeLogoRequestId = 0;

function loadColleges() {
    if (!collegesRequest) {
        collegesRequest = fetch('colleges.json').then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load colleges.json: ${response.status}`);
            }
            return response.json();
        });
    }

    return collegesRequest;
}

async function getCollegeLogoUrl(collegeName) {
    const colleges = await loadColleges();
    const college = colleges.find((entry) => entry.name === collegeName);

    if (!college) {
        console.error(`No matching college found for "${collegeName}".`);
        return '';
    }

    const logoUrl = `${NCAA_BASE_URL}/logo/${encodeURIComponent(college['college-id'])}.svg?dark=false`;
    return logoUrl;
}

function clearCollegeLogo(cancelPendingRequest = false) {
    if (cancelPendingRequest) {
        collegeLogoRequestId++;
    }

    modalCollegeLogo.classList.add('hidden');
    modalCollegeLogo.onload = null;
    modalCollegeLogo.onerror = null;
    modalCollegeLogo.removeAttribute('src');
    modalCollegeLogo.alt = '';
    modalCollegeLocated.classList.remove('hidden');
}

async function displayCollegeLogo(collegeName) {
    const requestId = ++collegeLogoRequestId;
    clearCollegeLogo();

    try {
        const logoUrl = await getCollegeLogoUrl(collegeName);

        if (requestId !== collegeLogoRequestId) return;
        if (!logoUrl) return;

        return new Promise((resolve) => {
            modalCollegeLogo.onload = () => {
                if (requestId === collegeLogoRequestId) {
                    modalCollegeLogo.classList.remove('hidden');
                    modalCollegeLocated.classList.add('hidden');
                }

                resolve();
            };
            modalCollegeLogo.onerror = () => {
                if (requestId === collegeLogoRequestId) {
                    console.error(`NCAA logo endpoint did not return a usable image for "${collegeName}".`, {
                        url: logoUrl
                    });
                    clearCollegeLogo();
                }

                resolve();
            };
            modalCollegeLogo.src = logoUrl;
            modalCollegeLogo.alt = `${collegeName} logo`;
        });
    } catch (err) {
        if (requestId !== collegeLogoRequestId) return;

        console.error(`Unable to display logo for "${collegeName}".`, err);
        clearCollegeLogo();
    }
}
