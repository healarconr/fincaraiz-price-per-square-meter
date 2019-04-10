// ==UserScript==
// @name         fincaraiz.com.co price per square meter
// @namespace    https://github.com/healarconr
// @version      0.1
// @description  Show the price per square meter in the search results of fincaraiz.com.co
// @author       Hernán Alarcón
// @match        https://www.fincaraiz.com.co/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function calculatePricePerSquareMeter() {
        calculatePricePerSquareMeterInSearchResults();
        calculatePricePerSquareMeterInANewProject();
    }
    function calculatePricePerSquareMeterInSearchResults() {
        const advertisements = document.querySelectorAll('#divAdverts .advert, #divAdverts .AD_OV');
        for (const advertisement of advertisements) {
            try {
                let pricePerSquareMeterElement = advertisement.querySelector('p.pricePerSquareMeter');
                if (pricePerSquareMeterElement) {
                    pricePerSquareMeterElement.remove();
                }
                const priceNode = advertisement.querySelector('.price');
                const price = findFirstNumber(priceNode.textContent);
                const area = findFirstNumber(advertisement.querySelector('.surface').textContent)
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                pricePerSquareMeterElement = document.createElement('p');
                pricePerSquareMeterElement.className = 'pricePerSquareMeter';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.insertBefore(pricePerSquareMeterElement, priceNode.querySelector('.compare_div'));
            } catch (e) {
                // Do nothing
            }
        }
    }
    function calculatePricePerSquareMeterInANewProject() {
        const offers = document.querySelectorAll('#typology tbody tr');
        for (const offer of offers) {
            try {
                const priceNode = offer.querySelector('td:nth-child(7)');
                const price = findFirstNumber(priceNode.textContent);
                const area = findFirstNumber(offer.querySelector('td:nth-child(3)').textContent);
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                const pricePerSquareMeterElement = document.createElement('div');
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.appendChild(pricePerSquareMeterElement);
            } catch (e) {
                // Do nothing
            }
        }
    }
    function findFirstNumber(value) {
        return parseFloat(value.match(/[\d.,]+/)[0].replace(/\./g, '').replace(/,/g, '.'));
    }
    const advertisementsContainer = document.querySelector('#divAdverts');
    if (advertisementsContainer) {
        new MutationObserver(calculatePricePerSquareMeter).observe(advertisementsContainer, {childList: true});
    }
    calculatePricePerSquareMeter();
})();