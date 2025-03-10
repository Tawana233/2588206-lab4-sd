document.addEventListener("DOMContentLoaded", function(){

    const button = document.getElementById("submitButton");
    const countryNameInput = document.getElementById("userInput");
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");

    button.onclick = async function(){

        const countryName = countryNameInput.value;
        const baseURl = "https://restcountries.com/v3.1/"
        const countryURL = "https://restcountries.com/v3.1/name/" + countryName;

        const myRequest = new Request(countryURL, {})

        try{
            const response = await fetch(myRequest);
            console.log(response);

            if(!response.ok){
                throw new Error(`Response status: ${Response.status}`);
            }

            const reader = response.body.getReader();
            let data = "";
            let done = false;

            while(!done){

                const {value, done: isDone} = await reader.read();
                done = isDone;

                data += new TextDecoder().decode(value);

            }

            reader.releaseLock();

            const dataAsJSON = JSON.parse(data)[0];
            console.log(dataAsJSON);

            const countryInfoList = document.createElement("ul");
            const capitalli = document.createElement("li");
            const populationli = document.createElement("li");
            const regionli = document.createElement("li");
            const flagli = document.createElement("li");
            const flagIm = document.createElement("img");

            const capital = "Captial: " + dataAsJSON.name.common;
            const population = "Population: " + dataAsJSON.population;
            const region = "Region: " + dataAsJSON.region;
            const flag = dataAsJSON.flags.svg;

            capitalli.textContent = capital;
            populationli.textContent = population;
            regionli.textContent = region;
            flagIm.src = flag;
            flagli.textContent = "Flag: ";

            countryInfoList.appendChild(capitalli);
            countryInfoList.appendChild(populationli);
            countryInfoList.appendChild(regionli);
            countryInfoList.appendChild(flagli);

            countryInfo.appendChild(countryInfoList);
            countryInfo.appendChild(flagIm);

            const listOfNeighs = dataAsJSON.borders;
            console.log(listOfNeighs);
            let ulNiegh = document.createElement("ul");
            let NeighFlags = [];

            for(const neigh of listOfNeighs){

                imgURL = "https://restcountries.com/v3.1/alpha/" + neigh;
                const getFlag = new Request(imgURL, {});

                const resp = await fetch(getFlag);

                if(!resp.ok){
                    throw new Error(`Response status: ${Response.status}`)
                }
                

                const readerResp = resp.body.getReader();
                let dataResp = "";
                let done = false;

                while(!done){

                    const {value, done: isDone} = await readerResp.read();
                    done = isDone;

                    dataResp += new TextDecoder().decode(value);

                }

                readerResp.releaseLock();
                
                const respAsJSON = JSON.parse(dataResp)[0];
                console.log(dataResp)

                fURL = respAsJSON.flags.svg;
                cname = respAsJSON.name.common;
                img = document.createElement("img");
                img.src = fURL;
                listItem = document.createElement("li");
                cnameItem = document.createElement("li");
                cnameItem.textContent = cname;
                listItem.appendChild(img);
                ulNiegh.appendChild(cnameItem);
                ulNiegh.appendChild(listItem);

            }

            const nbc = document.createElement("li");
            nbc.textContent = "Neighbouring Countries: ";
            borderingCountries.appendChild(nbc);
            borderingCountries.appendChild(ulNiegh);


        }
        catch(error){
            console.error(error.message);
        }
    }
   
    
});