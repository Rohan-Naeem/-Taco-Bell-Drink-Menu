document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            menuToggle.classList.toggle("active");
            mobileNav.classList.toggle("active");
        });

        mobileNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menuToggle.classList.remove("active");
                mobileNav.classList.remove("active");
            });
        });
    }


    const searchToggle = document.querySelector(".search-toggle");
    const searchOverlay = document.querySelector(".search-overlay");
    const closeSearch = document.querySelector(".close-search");
    const searchInput = document.querySelector("#drinkSearch");

    function openSearch() {
        if (searchOverlay) {
            searchOverlay.classList.add("active");
            document.body.classList.add("no-scroll");

            if (searchInput) {
                setTimeout(function () {
                    searchInput.focus();
                }, 150);
            }
        }
    }

    function closeSearchOverlay() {
        if (searchOverlay) {
            searchOverlay.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    }

    if (searchToggle) {
        searchToggle.addEventListener("click", openSearch);
    }

    if (closeSearch) {
        closeSearch.addEventListener("click", closeSearchOverlay);
    }

    if (searchOverlay) {
        searchOverlay.addEventListener("click", function (event) {
            if (event.target === searchOverlay) {
                closeSearchOverlay();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSearchOverlay();
        }
    });


    const filterButtons = document.querySelectorAll(".filter-btn");
    const drinkCards = document.querySelectorAll(".drink-card, .freeze-card, .refresh-card");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            const sectionTargets = {
                freeze: "freezes",
                refreshers: "refreshers",
                coffee: "coffee"
            };

            if (sectionTargets[filter]) {
                const section = document.getElementById(sectionTargets[filter]);

                drinkCards.forEach(function (card) {
                    card.classList.remove("hidden");
                });

                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }

                return;
            }

            drinkCards.forEach(function (card) {
                const category = card.getAttribute("data-category");

                if (filter === "all" || category === filter) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
        const question = item.querySelector(".faq-question");

        if (question) {
            question.addEventListener("click", function () {

                const isActive = item.classList.contains("active");

                faqItems.forEach(function (faq) {
                    faq.classList.remove("active");
                });

                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });


    const locationButton = document.querySelector("#locationButton");
    const locationInput = document.querySelector("#locationInput");
    const locationMessage = document.querySelector("#locationMessage");

    if (locationButton && locationInput && locationMessage) {

        locationButton.addEventListener("click", function () {

            const location = locationInput.value.trim();

            if (location === "") {
                locationMessage.textContent =
                    "Please enter a city, state, or ZIP code.";
                return;
            }

            window.open("https://www.tacobell.com/locations", "_blank", "noopener");

            locationMessage.textContent =
                "Opening Taco Bell's official location finder in a new tab — enter your ZIP or city there to see the menu at your nearest restaurant.";
        });

        locationInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                locationButton.click();
            }
        });
    }


    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 500) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        });

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    if (searchInput) {

        const searchBox = searchInput.parentElement;

        const suggestionBox = document.createElement("div");
        suggestionBox.className = "search-suggestions";

        if (searchBox) {
            searchBox.appendChild(suggestionBox);
        }

        function getDrinkName(card) {
            const nameElement = card.querySelector("h3");

            if (!nameElement) {
                return "";
            }

            return nameElement.textContent.trim();
        }

        function searchDrinks(searchTerm) {

            const term = searchTerm.trim().toLowerCase();

            suggestionBox.innerHTML = "";

            if (term === "") {
                suggestionBox.classList.remove("active");

                drinkCards.forEach(function (card) {
                    card.classList.remove("hidden");
                });

                return;
            }

            const matches = [];

            drinkCards.forEach(function (card) {

                const drinkName = getDrinkName(card);

                if (!drinkName) {
                    return;
                }

                const nameLower = drinkName.toLowerCase();

                if (nameLower.includes(term)) {
                    matches.push({
                        name: drinkName,
                        card: card
                    });
                }
            });


            if (matches.length > 0) {

                suggestionBox.classList.add("active");

                matches.slice(0, 8).forEach(function (match) {

                    const suggestion = document.createElement("button");

                    suggestion.type = "button";
                    suggestion.textContent = match.name;
                    suggestion.className = "search-suggestion-item";

                    suggestion.addEventListener("click", function () {

                        searchInput.value = match.name;

                        suggestionBox.classList.remove("active");

                        drinkCards.forEach(function (card) {
                            card.classList.add("hidden");
                        });

                        match.card.classList.remove("hidden");

                        closeSearchOverlay();

                        setTimeout(function () {
                            match.card.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });
                        }, 100);
                    });

                    suggestionBox.appendChild(suggestion);
                });

            } else {

                suggestionBox.classList.add("active");

                const noResult = document.createElement("div");

                noResult.className = "no-search-result";
                noResult.textContent = "No drinks found.";

                suggestionBox.appendChild(noResult);
            }
        }


        searchInput.addEventListener("input", function () {
            searchDrinks(searchInput.value);
        });


        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                const term = searchInput.value.trim().toLowerCase();

                if (term === "") {
                    return;
                }

                let firstMatch = null;

                drinkCards.forEach(function (card) {

                    const drinkName = getDrinkName(card);
                    const nameLower = drinkName.toLowerCase();

                    if (nameLower.includes(term)) {

                        card.classList.remove("hidden");

                        if (!firstMatch) {
                            firstMatch = card;
                        }

                    } else {
                        card.classList.add("hidden");
                    }
                });

                suggestionBox.classList.remove("active");

                if (firstMatch) {

                    closeSearchOverlay();

                    setTimeout(function () {
                        firstMatch.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }, 100);

                } else {

                    suggestionBox.classList.add("active");

                    suggestionBox.innerHTML =
                        '<div class="no-search-result">No drinks found. Try another drink name.</div>';
                }
            }
        });


        document.addEventListener("click", function (event) {

            if (
                !searchInput.contains(event.target) &&
                !suggestionBox.contains(event.target)
            ) {
                suggestionBox.classList.remove("active");
            }
        });
    }


    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});