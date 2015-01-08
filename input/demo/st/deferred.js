(function() {

    describe('Deferred', function() {
    	it("resolve",function(testDone){
    		var defer = st.Deferred();

    		function test(){
    			setTimeout(function(){
    				defer.resolve("test");
    			})
    			return defer.promise();

    		}

    		st.when(test()).done(function(result){
    			expect(result).toBe('test');
    			testDone();
    		})
    	})

    	it("multi resolve",function(testDone){
    		function test(){
    			var defer = st.Deferred();
    			setTimeout(function(){
    				defer.resolve("test");
    			})
    			return defer.promise();

    		}

    		function test2(){
    			var defer = st.Deferred();
    			setTimeout(function(){
    				defer.resolve("test2");
    			})
    			return defer.promise();

    		}

    		st.when(test(),test2()).done(function(result,result2){
    			expect(result).toBe('test');
    			expect(result2).toBe('test2');
    			testDone();
    		})
    	})

    	it("reject",function(testDone){
    		var defer = st.Deferred();

    		function test(){
    			setTimeout(function(){
    				defer.reject("test");
    			})
    			return defer.promise();
    		}

    		st.when(test()).fail(function(result){
    			expect(result).toBe('test');
    			testDone();
    		})
    	})
    });
})();