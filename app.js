console.log('Our app code here')

// User Story

// 1. when user enters a term in the search box and presses 
// 	 search images are returned from the nasa search api
// 	 (https://images-api.nasa.gov/search)

// 2. images are displayed on the page in batches of 12

// 3. if there are more than 12 images returned a link(s) appear in the footer
// 	  allowing the user to paginate through the pictures/

// Notes: Api call takes the following parameters - q=search_term, media_type=image

// 

const startPreviewer = () => {
    console.log('Page loaded')

    //fetchData = fetched data from API

    const fetchData = (searchVal) => {
        console.log(searchVal)

        // use fetch API to get data
        const url = `https://images-api.nasa.gov/search?q=${searchVal}&media_type=image`
        return fetch(url)
    }

    //pagination
    var pageNum = 1

    //listener to listen form submit

    //grab the form
    const searchForm = document.forms['search-form']  
   
    // add submit event on form

    searchForm.addEventListener('submit', function(e){
        e.preventDefault()
        console.log('Something searched !')

        //grab the search value
        const searchVal = document.getElementById('searchbox').value  
        fetchData(searchVal).then(response => {
            console.log(response)
            if(response.ok) {
                // convert response to json
                return response.json()
            }
            throw new Error('Api did not respond')
        }).then(response => {
            //process json for data req
            console.log(response)
            var apiData = response.collection.items
            //apiData[0].links[0].href === link to pictures
            //apiData[0].data[0].title === picture title
            // function map
            let imageData = apiData.map(item => {
                // return obj {src: "href", title: "title"}
                return {src: item.links[0].href, title: item.data[0].title}
            })
            console.log(imageData)

            const imageContainer = document.getElementById('images')
            const paginate = document.getElementById('seemore')

            
            let totalPages = Math.ceil(imageData.length / 12)


            const renderPage = () => {
                imageContainer.innerHTML = ""
            let imagesForRender = imageData.slice(pageNum * 12 - 12, pageNum * 12)

            imagesForRender.forEach(item => {
                let picDiv = document.createElement('div')
                let img = document.createElement('img')
                let captionDiv = document.createElement('div')
                picDiv.className = 'imgHolder'
                img.src = item.src
                img.alt = item.title
                captionDiv.textContent = item.title
                picDiv.appendChild(img)
                picDiv.appendChild(captionDiv)
                imageContainer.appendChild(picDiv)

            });

            if (totalPages > 1) {
                paginate.innerHTML = ""
                const backLink = () => {
                    let back = document.createElement('a')
                    back.id = 'back'
                    back.href = "#"
                    back.textContent = 'Back'
                    return back
                }
                const forwardLink = () => {
                    let forward = document.createElement('a')
                    forward.id = 'forward'
                    forward.href = "#"
                    forward.textContent = 'Forward'
                    return forward
                }
                if(pageNum > 1 && pageNum < totalPages) {
                    // diplay back and forward link
                    paginate.appendChild(backLink())
                    paginate.append("  |  ")
                    paginate.appendChild(forwardLink())
                }
                else if (pageNum === 1) {
                    // forward link only
                    paginate.appendChild(forwardLink())
                }
                else if (pageNum === totalPages) {
                    //backlink only
                    paginate.appendChild(backLink())
                }

            }
            }
            renderPage()



                paginate.addEventListener('click', (e) => {
                    e.preventDefault()
                    if(e.target.tagName === 'A') {
                        if(e.target.id === 'forward') {
                            // increment
                            pageNum += 1
                            //rerender images
                            renderPage()
                        }
                        else if (e.target.id === 'back') {
                            //decrement
                            pageNum -= 1
                             //rerender images
                             renderPage()
                        }
                    }
                })
            

        })
       
    })
}


window.addEventListener('load', startPreviewer())

