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
			String newLocation = basePath+"#/editdetail/?coid="+coid;
			response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
			response.setHeader("Location",newLocation);
		%>
	</body>
</html>