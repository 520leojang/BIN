define(
	["bin/common/indicator"],
	function(indicator)
	{
		var NetCallbackPolicy = function(netManager)
		{
			this._netManager = netManager;
		}

		var Class = NetCallbackPolicy.prototype;

		Class.init = function()
		{

		}

		Class.beforeSend = function(netParams)
		{
			var options = netParams.options;
			if(options.loading)
			{
				netParams.userdatas.indicatorID = indicator.show({model:options.loading === "MODEL"});
			}

			if(netParams.callbacks.beforeSend)
			{
				netParams.callbacks.beforeSend(netParams);
			}
		}

		Class.success = function(data, netParams)
		{
			if(netParams.callbacks.success)
			{
				netParams.callbacks.success(data, netParams);
			}
		}

		Class.error = function(error, netParams)
		{
			if(bin.runtimeConfig.debug)
			{
				console.error("API["+netParams.api+"] Error "+error.status+" "+error.statusText);
			}

			if(error.status === 0)
			{
				Notification.show
				({
					type: "error",
					message: "网络连接失败，请检查您的网络"
				});
			}
			else
			{
				Notification.show
				({
					type: "error",
					message: "网络错误，错误代码 "+error.status
				});

			}

			if(netParams.callbacks.error)
			{
				netParams.callbacks.error(error, netParams);
			}
		}

		Class.complete = function(netParams)
		{
			if(netParams.callbacks.complete)
			{
				netParams.callbacks.complete(netParams);
			}

			if(netParams.userdatas.indicatorID)
			{
				indicator.stop(netParams.userdatas.indicatorID);
			}
		}

		return NetCallbackPolicy;
	}
);