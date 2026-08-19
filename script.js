// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcgguEO4kF6u68tlDZsBf6f8Sj7Z0cpHFcQU6fSeRRlaHk0mhyav9De4EVIJUla_o0CA/exec";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxeOs5IJlm1LKHL6NNmhWaMdTMBuNq8cTnyi8xj8nKZO3HTusyW6F7KsROvPDwYw49zJw/exec";

const form = document.getElementById("mnsKingsForm");
const typePicker = document.getElementById("typePicker");
const startHero = document.getElementById("startHero");
const formBrand = document.getElementById("formBrand");
const mainCard = document.getElementById("mainCard");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");
const formTypeInput = document.getElementById("formType");
const formTypeBadge = document.getElementById("formTypeBadge");
const formPageTitle = document.getElementById("formPageTitle");
const kidsBadgeChip = document.getElementById("kidsBadgeChip");
const brandLogoWrap = document.getElementById("brandLogoWrap");
const formSubtitle = document.getElementById("formSubtitle");
const playerNameLabel = document.getElementById("playerNameLabel");
const playerNameInput = document.getElementById("playerName");
const phoneField = document.getElementById("phoneField");
const phoneNumberInput = document.getElementById("phoneNumber");
const kidsAgeField = document.getElementById("kidsAgeField");
const kidsAgeInput = document.getElementById("kidsAge");
const adultSizeField = document.getElementById("adultSizeField");
const kidsSizeField = document.getElementById("kidsSizeField");
const sleeveField = document.getElementById("sleeveField");
const sleeveLengthInput = document.getElementById("sleeveLength");
const nameOnTshirtInput = document.getElementById("nameOnTshirt");
const numberOnBackInput = document.getElementById("numberOnBack");
const backToPicker = document.getElementById("backToPicker");

let selectedFormType = "";

function setFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + "Error");
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearAllErrors() {
    form.querySelectorAll(".error").forEach(function (node) {
        node.textContent = "";
    });
    statusMessage.textContent = "";
    statusMessage.className = "status";
}

function applyFormMode(formType) {
    selectedFormType = formType;
    formTypeInput.value = formType;
    formTypeBadge.textContent = formType === "Kids" ? "For Kids" : "Self / Adult";
    formTypeBadge.classList.toggle("is-kids", formType === "Kids");

    const isKids = formType === "Kids";

    phoneField.hidden = isKids;
    kidsAgeField.hidden = !isKids;
    adultSizeField.hidden = isKids;
    kidsSizeField.hidden = !isKids;
    sleeveField.hidden = isKids;

    playerNameLabel.textContent = isKids ? "Child Name" : "Player Name";
    playerNameInput.placeholder = isKids ? "Enter child name" : "Enter player name";
    formSubtitle.textContent = isKids
        ? "Complete the kids registration form below."
        : "Complete the adult registration form below.";
    formPageTitle.textContent = isKids ? "Kids T-Shirt Form" : "T-Shirt Form";
    formBrand.classList.toggle("is-kids", isKids);
    brandLogoWrap.classList.toggle("is-kids", isKids);
    kidsBadgeChip.hidden = !isKids;

    phoneNumberInput.required = !isKids;
    kidsAgeInput.required = isKids;
    document.getElementById("tshirtSize").required = !isKids;
    document.getElementById("kidsTshirtSize").required = isKids;
    sleeveLengthInput.required = !isKids;

    if (isKids) {
        phoneNumberInput.value = "";
        document.getElementById("tshirtSize").value = "";
        sleeveLengthInput.value = "Half Sleeve";
    } else {
        kidsAgeInput.value = "";
        document.getElementById("kidsTshirtSize").value = "";
        if (sleeveLengthInput.value === "Half Sleeve") {
            sleeveLengthInput.value = "";
        }
    }
}

function showForm(formType) {
    applyFormMode(formType);
    typePicker.hidden = true;
    form.hidden = false;
    startHero.hidden = true;
    formBrand.hidden = false;
    mainCard.classList.remove("neon-card--start");
    mainCard.classList.add("neon-card--form");
    clearAllErrors();
    playerNameInput.focus();
}

function showTypePicker() {
    form.hidden = true;
    typePicker.hidden = false;
    startHero.hidden = false;
    formBrand.hidden = true;
    mainCard.classList.add("neon-card--start");
    mainCard.classList.remove("neon-card--form");
    selectedFormType = "";
    formTypeInput.value = "";
    form.reset();
    clearAllErrors();
}

function validateForm(data) {
    clearAllErrors();
    let isValid = true;
    const isKids = data.formType === "Kids";

    if (!data.formType) {
        statusMessage.textContent = "Please select a form type: Kids or Self / Adult.";
        statusMessage.className = "status error";
        return false;
    }

    if (!/^[A-Za-z ]{2,50}$/.test(data.playerName.trim())) {
        setFieldError("playerName", isKids ? "Please enter a valid child name." : "Please enter a valid player name.");
        isValid = false;
    }

    if (!isKids) {
        if (!/^[0-9]{10}$/.test(data.phoneNumber.trim())) {
            setFieldError("phoneNumber", "Phone number must be exactly 10 digits.");
            isValid = false;
        }
    }

    if (isKids) {
        const age = Number(data.kidsAge);
        if (!Number.isInteger(age) || age < 1 || age > 16) {
            setFieldError("kidsAge", "Please enter a valid age between 1 and 16 years.");
            isValid = false;
        }
    }

    if (!/^[A-Za-z0-9 ]{2,15}$/.test(data.nameOnTshirt.trim())) {
        setFieldError("nameOnTshirt", "Use 2–15 characters (letters and numbers only).");
        isValid = false;
    }

    if (!data.tshirtSize) {
        if (isKids) {
            setFieldError("kidsTshirtSize", "Please select a kids T-shirt size.");
        } else {
            setFieldError("tshirtSize", "Please select a T-shirt size.");
        }
        isValid = false;
    }

    if (!/^\d{1,3}$/.test(data.numberOnBack.trim())) {
        setFieldError("numberOnBack", "Back number must be 1–3 digits (for example: 001, 07, 700).");
        isValid = false;
    }

    if (!isKids && !data.sleeveLength) {
        setFieldError("sleeveLength", "Please select a sleeve length.");
        isValid = false;
    }

    return isValid;
}

function buildFormPayload() {
    const isKids = selectedFormType === "Kids";
    return {
        formType: selectedFormType,
        playerName: playerNameInput.value,
        phoneNumber: isKids ? "" : phoneNumberInput.value,
        kidsAge: isKids ? kidsAgeInput.value : "",
        nameOnTshirt: nameOnTshirtInput.value.toUpperCase(),
        tshirtSize: isKids
            ? document.getElementById("kidsTshirtSize").value
            : document.getElementById("tshirtSize").value,
        numberOnBack: numberOnBackInput.value,
        sleeveLength: isKids ? "Half Sleeve" : sleeveLengthInput.value
    };
}

function saveToGoogleSheet(data) {
    return new Promise(function (resolve, reject) {
        const iframeName = "gasSubmitFrame";
        let iframe = document.getElementById(iframeName);

        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = iframeName;
            iframe.name = iframeName;
            iframe.style.display = "none";
            iframe.setAttribute("aria-hidden", "true");
            document.body.appendChild(iframe);
        }

        const tempForm = document.createElement("form");
        tempForm.method = "POST";
        tempForm.action = GOOGLE_SCRIPT_URL;
        tempForm.target = iframeName;
        tempForm.style.display = "none";

        Object.keys(data).forEach(function (key) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);

        let settled = false;
        function finish(success) {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(fallbackTimer);
            if (tempForm.parentNode) {
                tempForm.parentNode.removeChild(tempForm);
            }
            if (success) {
                resolve();
            } else {
                reject(new Error("Unable to reach Google Apps Script."));
            }
        }

        iframe.onload = function () {
            finish(true);
        };

        const fallbackTimer = setTimeout(function () {
            finish(true);
        }, 4000);

        tempForm.submit();
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = buildFormPayload();

    if (!validateForm(formData)) {
        if (!statusMessage.textContent) {
            statusMessage.textContent = "Please fix highlighted fields.";
            statusMessage.className = "status error";
        }
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    try {
        await saveToGoogleSheet(formData);
        statusMessage.textContent = "Thank you, " + formData.playerName.trim() + ". Your T-shirt request has been received by the Team Captain.";
        statusMessage.className = "status success";
        setTimeout(function () {
            form.reset();
            clearAllErrors();
            showTypePicker();
        }, 5000);
    } catch (error) {
        if (error.message.includes("Unauthorized")) {
            statusMessage.textContent = "Access denied. Please ensure the Google Apps Script web app is set to “Anyone with the link”.";
        } else if (error.message.includes("Unable to reach")) {
            statusMessage.textContent = "Connection error. Please verify the web app URL and that access is set to “Anyone with the link”.";
        } else {
            statusMessage.textContent = "Unable to save your entry. Please try again.";
        }
        statusMessage.className = "status error";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Registration";
    }
}

document.getElementById("selectKids").addEventListener("click", function () {
    showForm("Kids");
});

document.getElementById("selectAdult").addEventListener("click", function () {
    showForm("Adult");
});

backToPicker.addEventListener("click", showTypePicker);
form.addEventListener("submit", handleFormSubmit);

playerNameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z ]/g, "");
});

phoneNumberInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

kidsAgeInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 2);
});

nameOnTshirtInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});

numberOnBackInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 3);
});

const logoPreviewBtn = document.getElementById("logoPreviewBtn");
const imageLightbox = document.getElementById("imageLightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");

function openImageLightbox() {
    imageLightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
}

function closeImageLightbox() {
    imageLightbox.hidden = true;
    document.body.style.overflow = "";
    logoPreviewBtn.focus();
}

logoPreviewBtn.addEventListener("click", openImageLightbox);
lightboxBackdrop.addEventListener("click", closeImageLightbox);
lightboxClose.addEventListener("click", closeImageLightbox);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !imageLightbox.hidden) {
        closeImageLightbox();
    }
});
