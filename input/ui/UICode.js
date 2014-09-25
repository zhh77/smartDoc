
/**
    ui测试模块
    @module uiModule
*/
(function() {

	 /**
     * ui测试类
     * @class UI
     * @constructor
     * @content {string} type 内容
     * @example
     * 		<html>
     * 			<div id='container'></div>
     * 		</html>
     * 		<script>
     *
     * 			//ui code输出
     * 			$('#container').append("<div>UI测试</div>");
     * 			
     *    		//log输出
     * 			log('this is a message');
     *
     * 			//expect === 输出
     * 			expect(1).toBe(true);
     *
     * 			//expect == 输出
     * 			expect(1).toEqual(true);
     * 		</script>
     */		
	function UI(content){
		this.init(content);
	}

	UI.prototype = {
		/**
		 * ui初始化方法
		 * @method init
		 * @param  {string} content 内容
		 */
		init : function(content){
			this.content = content;
		},
		/**
		 * 渲染方法
		 * @method render
		 * @return {string} 渲染后的html
		 */
		render : function(){
			return '<div>' + this.content + '</div>';
		}
	}

	window["UI"] = UI;
})();