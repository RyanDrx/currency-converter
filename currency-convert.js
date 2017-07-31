const axios = require('axios');

const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
        return response.data.rates[to];
    } catch (error) {
        throw new Error(`Unable to get exchange rate for ${from} to ${to}`)
    }

};

const getCountries = async (currencyCode) => {
    try {
        
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
        const rate = response.data.map((country) => country.name);

        if (rate) {
            return rate;
        }
        else {
            throw new Error();
        }

    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }
};

const convertCurrency = (from, to, amount) => {
    let countries;
    return getCountries(to).then((tempCountries) => {
        countries = tempCountries;
        return getExchangeRate(from, to);
    }).then((rate) => {
        const exchangedAmount = amount * rate;

        return `${amount} ${from} is worth ${exchangedAmount} ${to}.
        ${to} can be used on the following:
            ${countries.join(', ')} `;
    });
}

const convertCurrencyAlt = async (from, to, amount) => {

    const countries = await getCountries(to);
    const rate = await getExchangeRate(from, to);

    const exchangedAmount = amount * rate;

    return `${amount} ${from} is worth ${exchangedAmount} ${to}. 
        ${to} can be used on the following:
        ${countries.join(', ')} `;

}

convertCurrencyAlt('USD', 'CAD', 100).then((amount) => {
    console.log(amount);
}).catch((e) => {
    console.log(e.message);
});

// getCountries('CAD').then((countries) => {
//     console.log(countries);
// });

// getExchangeRate('USD', 'CAD').then((rate) => {
//     console.log(rate);
// });