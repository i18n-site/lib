;(async () => {
  const alertErr = (err) => { alert(JSON.stringify(err,null,2)) };
	const API = "https://hrai-api.xxx.com/",
		conf = await (
			await fetch(API + "conf", {
				method: "POST",
				body: location.href.split("#")[0],
			})
		).json()
	h5sdk.config({
		...conf,
		jsApiList: [],
		onSuccess: (res) => {
			console.log(`config success: ${JSON.stringify(res)}`)
			tt.requestAccess({
				scopeList: [],
				appID: conf.appId,
				success(res) {
					console.log("登录授权成功", JSON.stringify(res.code))
				},
				fail:alertErr
			})
		},
		onFail:alertErr
	})
})()

/*
tt.getUserInfo({
  // getUserInfo API 调用成功回调
  success(res) {
    console.log('userInfo',res.userInfo);
  },
  // getUserInfo API 调用失败回调
  fail(err) {
    console.log(`getUserInfo failed:`, JSON.stringify(err));
  },
});
*/
