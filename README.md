# TSPL Label Print App使用说明
背景：
当您需要使用扫码枪扫描二维码并将其信息提取出来，然后将提取的信息与其他字符串（如URL）组合，最终生成一个新的二维码并打印出来时。比如一个Wi-Fi模块的MAC地址提取出来组合到URL中，贴附到产品外包装，供用户扫码绑定产品。Label Print App 可以帮助您将这些繁琐的步骤自动化执行。

前置条件：
标签打印机必须支持tspl指令集，推荐TSC品牌打印机。
连接打印机电脑需要配置Java环境，Java版本需要≥17。
标签打印机固件需要内置字体，否则无法打印文本。
Windows环境使用步骤：
1. 官网下载标签打印机驱动并连接打印机进行安装。
2. 使用Zadig安装通用USB驱动程序。
下载地址：https://zadig.akeo.ie/
- 注意：安装通用USB驱动程序，原来的标签打印软件将无法连接打印机，如BarTender。
打开Zadig程序，点击Options，点击 List All Devices列出所有USB设备。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/7b5fe39b-a489-431a-9ef9-57e9ff28c454)


- 在下拉列表中找到标签打印机，记录USB ID，后续会使用到。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/39db42b5-b5e4-48dd-8f71-403c56f9fd2e)


3. 配置Java环境。
访问https://jdk.java.net/22/下载OpenJDK 22并解压到一个英文目录。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/04e4f00c-fded-4731-af1b-c9967793699a)


- 右键此电脑，点击属性
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/5e9f1b5b-2be3-462e-bf8f-f8d98043a1b9)


- 选择【高级】选项，点击【环境变量】。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/50da2e7c-4c40-4e7f-acbd-f41fc46af964)


- 找到【系统变量】一栏，点击【新建】按钮。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/a1d4bb14-3bcc-4894-beb4-7c4f55b669f2)


- 这里先建一个 JAVA_HOME 的环境变量名，变量值为 C:\Users\86155\Desktop\jar\jdk-22(解压缩的jdk根目录) 这是我的jdk系统默认安装路径。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/5c955ac7-f897-443e-b6e6-4491bf0c01e7)


- 找到系统变量名为【path】的环境变量，点击编辑，新建输入%JAVA_HOME%\bin，确定保存。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/4857eb17-696c-4637-a7d4-a996818a5e8b)


- 打开cmd命令行窗口，输入java -version出现下载的对应Java版本信息即表示配置成功。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/bc3c6c1e-4af2-4001-86fa-ac75f735ab29)


4. 将Label Print App jar文件放在一个英文目录中，使用cmd命令行打开。
使用cd命令打开jar文件所在目录
使用java -jar命令运行Label Print App程序，看到如下信息即表示后端运行成功。cmd窗口不能关闭。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/768b78eb-1920-483f-8289-921de1df8439)


5. 访问前端网页。
浏览器输入http://localhost:8080,访问前端页面。推荐使用谷歌Chrome浏览器，前端页面如下：
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/5f6c5bc4-1e2f-41dc-8ef1-b0bdb1fbc2b9)


- 参数填写说明：
打印机制造商ID：填入在Zadig记录的制造商ID：1A86
打印机产品ID:填入在Zadig记录的产品ID：7523
二维码大小：根据实际打印出的二维码大小进行选择。
二维码纠错等级：推荐选低即可。
打印角度：推荐0度。
打印份数：根据实际情况选择。
1mm 像素比例：参考标签打印机说明文档，比如300 DPI,表示打印机在每英寸长度内能够打印的点数。
标签间距：如下图所示m
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/3cee3669-f5e8-4e2c-833d-2d21bbed62c9)


- 文本相对二维码左下角X方向偏移量(mm)，文本相对二维码左下角Y方向偏移量(mm)：如下图箭头所指为原点(0,0)，相对于二维码qrCode左下角的偏移量。
![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/92e5db0c-5b67-4149-8541-e54cc8b1368f)


- 文本宽度放大比率，文本高度放大比率：推荐选择1。
字体选择：根据实际情况选择字体大小。
要打印的文本：可以手动填写，也可以按{group0}格式填写，表示使用后面正则表达式匹配到的第一组数据作为二维码下面的打印文本，如果是{group1}表示使用正则匹配到的第二组数据作为打印文本，以此类推。
标签宽(mm)：根据实际情况填写（x方向）
标签长(mm)：根据实际情况填写（y方向）
二维码宽度(mm)：（x方向）
二维码长度(mm)：（y方向）
正则表达式：根据实际情况填写，必须使用”()”进行分组匹配，否则无法使用匹配到的数据。默认为：/IMEI:(\d{15}),MAC:([A-Fa-f0-9]{12})/，表示提取扫码枪从二维码中提取的imei和mac信息。
待匹配数据：可以是扫码枪扫描出来的信息，也可以手动填写。推荐使用扫码枪扫描自动提取信息，自动提交，程序会自动清空输入框，以达到自动化的效果。举例数据：IMEI:863488059969573,MAC:C8A8C64C49AF
URL 地址：http://example.com/pid?imei={group0}&mac={group1}，其中{group0}表示使用正则匹配到的第1组数据，{group1}表示正则匹配到的第2组数据，以此类推。
- 其他说明：在页面按F12，点击Console，查看提交的数据是否正确。
 

![image](https://github.com/mylifeinn/mylifeinn.github.io/assets/61771600/b79ea2a4-af55-42b0-b75d-d348a69bb872)
