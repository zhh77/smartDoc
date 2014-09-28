
/**
    ui测试模块；
    * 提供了example的html与js实例；
    * example中引用了jquery的dns和本模块的uiCode.js文件
    @module uiModule
*/
(function() {

	 /**
     * ui测试类； 
     * @class UI
     * @constructor
     * @content {string} type 内容
     * @example
     * 		<html>
     * 			<div id='container'>html render</div>
     * 		</html>
     * 		<script>
     *
     * 			//ui code输出
     *              var ui = new UI("UI测试");
     * 			$('#container').append(ui.render());
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