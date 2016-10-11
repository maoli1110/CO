

var BimCo;
if (!BimCo)
	BimCo = {};
(function() {
	// 获取bimco服务器地址
	BimCo.GetBimCoUrl = function() {
		native function GetBimCoUrl();
		return GetBimCoUrl();
	};
	// 获取消息推送服务器地址
	// servType: offline、online、time
	// 
	BimCo.GetPushServUrl = function(servType) {
		native function GetPushServUrl();
		return GetPushServUrl(servType);
	};
	// 通知消息提示
	BimCo.NotifyTrayIcon = function(msg) {
		native function NotifyTrayIcon();
		return NotifyTrayIcon(msg);
	};
	// 显示消息推送对话框
	BimCo.ShowPushMsg = function() {
		native function ShowPushMsg();
		return ShowPushMsg();
	};
	// 登录
	BimCo.Login = function(usrName, usrPwd, servAddr) {
		native function Login();
		return Login(usrName, usrPwd, servAddr);
	};
	// 切换企业
	BimCo.ChangeEnterprise = function(eptID) {
		native function ChangeEnterprise();
		return ChangeEnterprise(eptID);
	};
	// 选择构件
	BimCo.SelectComponent = function(ppid) {
		native function SelectComponent();
		return SelectComponent(ppid);
	};
	// 获取用户选择构件状态
	// 001 选择完成
	// 002 选择取消
	BimCo.GetSelectComponentStatus = function(ppid) {
		native function GetSelectComponentStatus();
		return GetSelectComponentStatus(ppid);
	};
	// 上传构件信息
	BimCo.UpLoadComponent = function(coid) {
		native function UpLoadComponent();
		return UpLoadComponent(coid);
	};
	// 当成功创建了一个协作通知程序
	BimCo.CreateCoSucceed = function() {
		native function CreateCoSucceed();
		return CreateCoSucceed();
	};
	// 定位等
	BimCo.LocateComponent = function(ppid, coid) {
		native function LocateComponent();
		return LocateComponent(ppid, coid);
	};
	// 当网络出错的时候调用
	BimCo.WebErrorOccurred = function(requestUrl, responseCode, responseBody) {
		native function WebErrorOccurred();
		return WebErrorOccurred(requestUrl, responseCode, responseBody);
	};
	// 最大化、最小化、还原、关闭
	// SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
	BimCo.SysCommand = function(command) {
		native function SysCommand();
		return SysCommand(command);
	};
	// 打开文件、选择合适的应用程序
	BimCo.OpenFile = function(file) {
		native function OpenFile();
		return OpenFile(file);
	};
	// 打开资源管理器
	BimCo.OpenFolder = function(foler) {
		native function OpenFolder();
		return OpenFolder(foler);
	};
	// 获取当前浏览器的id 根据id可以获取诸多信息
	BimCo.GetBrowserID = function() {
		native function GetBrowserID();
		return GetBrowserID();
	};
	// 根据id获取用户数据 返回值为json对象
	BimCo.GetBrowserUsrData = function(browserID) {
		native function GetBrowserUsrData();
		return GetBrowserUsrData(browserID);
	};

	// 进入页面调用
	BimCo.PdfSign = function (uuid,suffix,react,coid) {
		native function PdfSign();
		return PdfSign(uuid,suffix,react,coid);
	}
	
	//签署意见
	BimCo.CommentSign = function (uuid,suffix) {
		native function CommentSign();
		return CommentSign(uuid,suffix);
	}
	//电子签名
	BimCo.ElectronicSign = function (euuid) {
	   	native function ElectronicSign();
		return ElectronicSign(euuid);
	}
	//提交
	BimCo.SignSubmit = function (coid) {
		native function SignSubmit();
		return SignSubmit(coid);
	}

	//取消
	BimCo.SignCancel = function () {
		native function SignCancel();
		return SignCancel();
	}

	//清空
	BimCo.SignEmpty = function () {
		native function SignEmpty();
		return SignEmpty();		
	}

	BimCo.SubmitAll = function () {
		native function SubmitAll();
		return SubmitAll();
	}

	BimCo.CancelSubmitAll = function () {
		native function CancelSubmitAll();
		return CancelSubmitAll();
	}

	BimCo.ExportCooperation = function (strExportInfo, strCoName) {
		native function ExportCooperation();
		return ExportCooperation(strExportInfo, strCoName);
	}

	//是否改动
	BimCo.IsModify = function () {
		native function IsModify();
		return IsModify();
	}

	//MessageBox
	BimCo.MessageBox = function (strText, strCaption, Flag) {
		native function MessageBox();
		return MessageBox(strText, strCaption, Flag);
	}
	
	// 音乐播放 返回值
	BimCo.AudioPlay = function (audioFile) {
		native function AudioPlay();
		return AudioPlay(audioFile);
	}
	// 音乐暂停
	BimCo.AudioPause = function (audioID) {
		native function AudioPause();
		return AudioPause(audioID);
	}
	// 音乐继续
	BimCo.AudioContinue = function (audioID) {
		native function AudioContinue();
		return AudioContinue(audioID);
	}
	// 音乐停止
	BimCo.AudioStop = function (audioID) {
		native function AudioStop();
		return AudioStop(audioID);
	}
	// 音乐销毁
	BimCo.AudioDestroy = function (audioID) {
		native function AudioDestroy();
		return AudioDestroy(audioID);
	}
})();


























