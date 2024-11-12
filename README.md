# TSPL Label Print App使用说明

# 背景：

当您需要使用扫码枪扫描二维码并将其信息提取出来，然后将提取的信息与其他字符串（如URL）组合，最终生成一个新的二维码并打印出来时。比如一个Wi-Fi模块的MAC地址提取出来组合到URL中，贴附到产品外包装，供用户扫码绑定产品。Label Print App 可以帮助您将这些繁琐的步骤自动化执行。

# 前置条件：

- 标签打印机必须支持tspl指令集，推荐TSC品牌打印机。
- 连接打印机电脑需要配置Java环境，Java版本需要≥17。
- 标签打印机固件需要内置字体，否则无法打印文本。

# Windows环境使用步骤：

## 1. 官网下载标签打印机驱动并连接打印机进行安装。

## **2. 使用Zadig安装通用USB驱动程序。**

- 下载地址：https://zadig.akeo.ie/
- 注意：安装通用USB驱动程序，原来的标签打印软件将无法连接打印机，如BarTender。
- 打开Zadig程序，点击Options，点击 List All Devices列出所有USB设备。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/ff968241-7127-4c79-b8b3-e3a5c8a1fd53/Untitled.png)

- 在下拉列表中找到标签打印机，记录USB ID，后续会使用到。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/a4dce137-45ca-4309-b619-bde30ea6051d/Untitled.png)

## 3. 配置Java环境。

- 访问https://jdk.java.net/22/下载OpenJDK 22并解压到一个英文目录。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/4ada1b02-5200-42ad-baa3-7b68bf199403/Untitled.png)

- 右键此电脑，点击属性

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/565836c9-0407-4202-ac18-dcff2e1ec3b5/Untitled.png)

- **选择【高级】选项，点击【环境变量】。**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/ffb6de24-69a2-4d9d-8937-539bea83158a/10b0b199-1ab9-43b7-b380-c04ddc1b39ae.png)

- **找到【系统变量】一栏，点击【新建】按钮。**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/5f84c84b-26cf-4ddc-9e41-623a52017024/3d53ba87-811d-4601-a754-7cf8a67f9069.png)

- **这里先建一个 JAVA_HOME 的环境变量名，变量值为 C:\Users\86155\Desktop\jar\jdk-22(解压缩的jdk根目录) 这是我的jdk系统默认安装路径。**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/104960a1-a749-4aca-9ff1-24a20a356b1d/Untitled.png)

- **找到系统变量名为【path】的环境变量，点击编辑，新建输入%JAVA_HOME%\bin，确定保存。**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/f35b98c6-6f5f-4ee9-827d-f5b6cd09db89/Untitled.png)

- 打开cmd命令行窗口，输入java -version出现下载的对应Java版本信息即表示配置成功。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/5d3bd3c5-33ac-47e4-8ba9-0e075d3f9897/Untitled.png)

## 4. 将Label Print App jar文件放在一个英文目录中，使用cmd命令行打开。

- 使用cd命令打开jar文件所在目录
- 使用java -jar命令运行Label Print App程序，看到如下信息即表示后端运行成功。cmd窗口不能关闭。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/32f7942d-b601-422c-944b-25ab29545c18/Untitled.png)

## 5.访问前端网页。

- 浏览器输入http://localhost:8080,访问前端页面。推荐使用谷歌Chrome浏览器，前端页面如下：

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/104a00c1-e446-4a8b-af08-0f28fffcae25/Untitled.png)

- 参数填写说明：
1. 打印机制造商ID：填入在Zadig记录的制造商ID：1A86
2. 打印机产品ID:填入在Zadig记录的产品ID：7523
3. 二维码大小：根据实际打印出的二维码大小进行选择。
4. 二维码纠错等级：推荐选低即可。
5. 打印角度：推荐0度。
6. 打印份数：根据实际情况选择。
7. 1mm 像素比例：参考标签打印机说明文档，比如300 DPI,表示打印机在每英寸长度内能够打印的点数。
8. 标签间距：如下图所示m

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/4bd3b513-e426-4282-869d-fa8a80c7d966/Untitled.png)

1. 文本相对二维码左下角X方向偏移量(mm)，文本相对二维码左下角Y方向偏移量(mm)：如下图箭头所指为原点(0,0)，相对于二维码qrCode左下角的偏移量。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/0b33bc78-05b0-436e-9e5a-eacaa4f2cfaf/Untitled.png)

1. 文本宽度放大比率，文本高度放大比率：推荐选择1。
2. 字体选择：根据实际情况选择字体大小。
3. 要打印的文本：可以手动填写，也可以按{group0}格式填写，表示使用后面正则表达式匹配到的第一组数据作为二维码下面的打印文本，如果是{group1}表示使用正则匹配到的第二组数据作为打印文本，以此类推。
4. 标签宽(mm)：根据实际情况填写（x方向）
5. 标签长(mm)：根据实际情况填写（y方向）
6. 二维码宽度(mm)：（x方向）
7. 二维码长度(mm)：（y方向）
8. 正则表达式：根据实际情况填写，必须使用”()”进行分组匹配，否则无法使用匹配到的数据。默认为：/IMEI:(\d{15}),MAC:([A-Fa-f0-9]{12})/，表示提取扫码枪从二维码中提取的imei和mac信息。
9. 待匹配数据：可以是扫码枪扫描出来的信息，也可以手动填写。推荐使用扫码枪扫描自动提取信息，自动提交，程序会自动清空输入框，以达到自动化的效果。举例数据：IMEI:863488059969573,MAC:C8A8C64C49AF
10.  URL 地址：[http://example.com/pid?imei={group0}&mac={group1}](http://example.com/pid?imei=%7Bgroup0%7D&mac=%7Bgroup1%7D)，其中{group0}表示使用正则匹配到的第1组数据，{group1}表示正则匹配到的第2组数据，以此类推。
11. 其他说明：在页面按F12，点击Console，查看提交的数据是否正确。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c940d8ed-2f55-4ded-a8ea-8632a26222dd/24fb0bc7-51f2-4430-aa82-9fa5400f1a75/Untitled.png)
