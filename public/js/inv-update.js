document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#updateForm");
    form.addEventListener("change", function () {
        const updateBtn = document.querySelector(".form-submit");
        updateBtn.removeAttribute("disabled");
    });
});