import $ from 'jquery';

export default class Ellipsis {
  
    init(container = document.body) {
      let components = $(container).find('*[data-ellipsis]');
      this.process(components);
    }
    
    process(components) {
      components.map( (index, component) => {
        let maxChar  = parseInt($(component).attr('data-max-char'), 10);
        if(component.innerText.length > maxChar) {
          this.collapse(component);          
        }
      });
    }
    
    collapse(component, trimText = null, completeText = null) {
      let maxChar  = parseInt($(component).attr('data-max-char'), 10);
      let fullText = completeText? completeText : component.innerHTML;
      if (!trimText) {
        trimText = fullText.slice(0, maxChar);
      }
      let trimDownInnerHtml = trimText; 
      const readMoreHTML = `<button class="ellipsis expand">...Read More</button>`;
      trimDownInnerHtml += readMoreHTML; 
      component.innerHTML = trimDownInnerHtml;
      this.bindReadMoreEvent(component, trimText, fullText);
    }

    expand(component, trimText, fullText) {
      const readLessHTML = `<button class="ellipsis collapsed">Read Less</button>`;
      component.innerHTML = fullText + readLessHTML;
      this.bindReadLessEvent(component, trimText, fullText);
    }

    bindReadMoreEvent(component, trimText, fullText) {
      $(component).find('.ellipsis.expand').off('click').on('click', (event) => {
        event.stopPropagation();
        this.expand(component, trimText, fullText);
      });
    }

    bindReadLessEvent(component, trimText, completeText) {
      $(component).find('.ellipsis.collapsed').off('click').on('click', (event) => {
        event.stopPropagation();
        this.collapse(component, trimText, completeText);
      });
    }
  
  }