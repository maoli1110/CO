<%@page pageEncoding="utf-8" contentType="text/html; charset=utf-8"%> 
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8; IE=edge"/>
		<meta name="renderer" content="webkit"> 
		<title></title> 
	</head>
	<body>
		<%  
			String coid = request.getParameter("coid");  
			String path = request.getContextPath();
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
			String newLocation = basePath+"#/sharedetail/?coid="+coid;			
			request.getSession(true).setAttribute("isFromShare", true); 
			response.sendRedirect(newLocation); 
		%>
	</body>
</html>