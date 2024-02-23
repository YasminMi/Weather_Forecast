document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showALert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = '03fb722a784d35836485f87ee07f092d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&Lang=pt_br`

    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.cod === 200) {
        // Traduzindo a descrição do clima para português
        const translatedDescription = await traduzirTexto(json.weather[0].description);
        json.weather[0].description = translatedDescription;

        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
        });
    } else {
        document.querySelector("#weather").classList.remove('show');
        showALert(`Não foi possível localizar...
        
        <img src="src/img/faq.svg"/>
        `)
    }
});

async function traduzirTexto(texto, idiomaOrigem = 'en', idiomaDestino = 'pt') {
    // Implementação da tradução usando googletrans
    // Certifique-se de adicionar o pacote 'googletrans' ao seu projeto
    // Esta é uma operação assíncrona, portanto, usamos 'await'
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURI(texto)}&langpair=${idiomaOrigem}|${idiomaDestino}`);
    const data = await response.json();
    return data.responseData.translatedText;
}

function showInfo(json){
    showALert('');

    document.querySelector("#weather").classList.add('show');

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;

    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h`;
}

function showALert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}
