var jsdom = require('jsdom');
const {JSDOM} = jsdom;

exports.scrape = (req, res)=>{

  let toiUrl = 'https://timesofindia.indiatimes.com/coronavirus';
  let ndtvUrl = 'https://www.ndtv.com/coronavirus';
  let indiatodayUrl = 'https://www.indiatoday.in/coronavirus-covid-19-outbreak';
  
  let newsJson = {
    latestNews: []
  }

  JSDOM.fromURL(toiUrl).then(dom=>{

    let titleArray = [];
    let urlArray = [];
    let sourceArray = [];
    
    let parentDom =  dom.window.document.querySelector('.news-list').firstElementChild
      .nextElementSibling
      .firstElementChild
      .nextElementSibling;

    titleArray.push(parentDom.firstElementChild.firstElementChild.textContent);

    let tempDomLeftCol =parentDom 
      .firstElementChild
      .firstElementChild
      .nextElementSibling
      .childNodes;

    let tempDomRightCol = parentDom.firstElementChild
      .nextElementSibling
      .firstElementChild
      .childNodes;

    let tempDomRightBottomCol = parentDom
      .firstElementChild
      .nextElementSibling
      .firstElementChild
      .nextElementSibling
      .firstElementChild
      .childNodes;

    tempDomLeftCol.forEach(node=>{
      let tempText = node.textContent;
      titleArray.push(tempText);
    });

    tempDomRightCol.forEach(node=>{
      let tempText = node.textContent;
      titleArray.push(tempText);
    });

    tempDomRightBottomCol.forEach(node=>{
      let tempText = node.textContent;
      titleArray.push(tempText);
    })


    console.log(titleArray);


    //newsJson.latestNews.push({
      //"title": tempTitle,
      //"url": tempUrl,
      //"source": tempSource
    //})

  })
}
