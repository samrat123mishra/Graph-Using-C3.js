import $ from 'jquery';
import Ellipsis from "../../src/common/js/ellipsis";

describe('Ellipsis module', () => {
	let ellipsisModule;
	beforeEach(() => {
        ellipsisModule = new Ellipsis();
    });

    it('should check collapse method', () => {
    	spyOn(ellipsisModule, 'bindReadMoreEvent').and.returnValue(true);
    	spyOn(window, 'parseInt').and.returnValue(1);

    	ellipsisModule.collapse({
    		innerHTML: {
    			slice: () => { return 'Lorem ipsum dolor sit amet'; }
    		}
    	});

    	expect(ellipsisModule.bindReadMoreEvent).toHaveBeenCalled()
    });

    it('should check expand method', () => {
    	spyOn(ellipsisModule, 'bindReadLessEvent').and.returnValue(true);
    	spyOn(window, 'parseInt').and.returnValue(1);

    	ellipsisModule.expand({
    		innerText: {
    			slice: () => { return 'Lorem ipsum dolor sit amet'; }
    		}
    	});

    	expect(ellipsisModule.bindReadLessEvent).toHaveBeenCalled()
    });
});
