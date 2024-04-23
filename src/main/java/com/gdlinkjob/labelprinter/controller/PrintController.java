package com.gdlinkjob.labelprinter.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gdlinkjob.labelprinter.entity.PrintRequest;
import lombok.extern.slf4j.Slf4j;
import org.fintrace.core.drivers.tspl.commands.label.BarcodeAlignment;
import org.fintrace.core.drivers.tspl.commands.label.BarcodeRotation;
import org.fintrace.core.drivers.tspl.commands.label.DataMatrix;
import org.fintrace.core.drivers.tspl.commands.label.ErrorCorrectionLevel;
import org.fintrace.core.drivers.tspl.commands.label.QRCode;
import org.fintrace.core.drivers.tspl.commands.label.QREncodeMode;
import org.fintrace.core.drivers.tspl.commands.label.QRMask;
import org.fintrace.core.drivers.tspl.commands.label.QRModel;
import org.fintrace.core.drivers.tspl.commands.label.TSPLLabel;
import org.fintrace.core.drivers.tspl.commands.label.Text;
import org.fintrace.core.drivers.tspl.commands.system.ClearBuffer;
import org.fintrace.core.drivers.tspl.commands.system.Direction;
import org.fintrace.core.drivers.tspl.commands.system.Gap;
import org.fintrace.core.drivers.tspl.commands.system.MeasurementSystem;
import org.fintrace.core.drivers.tspl.commands.system.Print;
import org.fintrace.core.drivers.tspl.commands.system.Size;
import org.fintrace.core.drivers.tspl.connection.TSPLConnectionClient;
import org.fintrace.core.drivers.tspl.connection.USBConnectionClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Slf4j
public class PrintController {

  @PostMapping("/print")
  public ResponseEntity<?> printLabel(@RequestBody String printRequestJson) {
    try {
      // 将 JSON 请求解析为 MyRequest 对象
      ObjectMapper mapper = new ObjectMapper();
      PrintRequest request = mapper.readValue(printRequestJson, PrintRequest.class);
      // 连接打印机并发送打印指令
      printLabelText(request);
      return ResponseEntity.ok("Print request received and processed successfully.");
    } catch (Exception e) {
      log.error("error",e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Error occurred: " + e.getMessage());
    }
  }

  private void printLabelText(PrintRequest content) throws Exception {
    System.out.println("请求对象:"+content);
    // 创建USB连接客户端
    TSPLConnectionClient tsplConnectionClient = new USBConnectionClient(Short.parseShort(content.getVenderId(),16),Short.parseShort((content.getProductId()),16) );
    System.out.println("打印机对象:"+tsplConnectionClient);

    // 初始化打印机
    tsplConnectionClient.init();

    // 建立连接
    tsplConnectionClient.connect();
    System.out.println("打印机连接成功:"+tsplConnectionClient.isConnected());

    try {
      // 构建打印指令
      TSPLLabel tsplLabel = TSPLLabel.builder()
        .element(Size.builder().labelWidth(content.getLabelWidth()).sizeMeasurementSystem(MeasurementSystem.METRIC).labelLength(content.getLabelLength()).build())
        .element(Gap.builder().labelDistance(content.getLabelDistance()).measurementSystem(MeasurementSystem.METRIC).labelOffsetDistance(0f).build())
        .element(Direction.builder().printPositionAsFeed(Boolean.TRUE).build())
        .element(ClearBuffer.builder().build())
        .element(
          QRCode.builder()
            .xCoordinate((int)((content.getLabelWidth()-content.getQrcodeX())/2*content.getDots()))
            .yCoordinate((int)((content.getLabelLength()-content.getQrcodeY())/2*content.getDots()))
            .cellWidth(content.getCellWidth())
            .errorCorrectionLevel(content.getErrorCorrectionLevel())
            .mode(QREncodeMode.A)//默认自动编码
            .rotation(content.getRotation())
            .mask(QRMask.S7)
            .model(QRModel.M2)
          .content(content.getUrl()).build())
        .element(Text.builder()
          // .xCoordinate((int)(((content.getLabelWidth()-content.getQrcodeX())/2+content.getTextStringX())*content.getDots()))
          /**
           * 通过字符数量计算文本x位置
           * textX=((标签宽*dots)-(字符数*对应字体x方向Dots))/2+(offsetX*dots)
           * y基于二维码的y直接进行偏移
           * textY=((标签长-二维码长)/2+ 二维码长+offsetY)*dots
           */
          .xCoordinate((int)((content.getLabelWidth()*content.getDots()- content.getTextString().length()*content.getFontDots())/2+content.getTextStringX()*content.getDots()))
          .yCoordinate((int)(((content.getLabelLength()-content.getQrcodeY())/2+content.getQrcodeY()+content.getTextStringY())*content.getDots()))
          .fontName(content.getTextStringType())
          .rotation(content.getRotation())
          .xMultiplicationFactor(content.getMultipliCationX())
          .yMultiplicationFactor(content.getMultipliCationY())
          .content(content.getTextString())
          .build())
        .element(Print.builder().nbLabels(content.getNbLabels()).build())
        .build();

      System.out.println("发送的指令:"+tsplLabel.getElements());

      // 发送打印指令
      tsplConnectionClient.send(tsplLabel);
    } finally {
      // 断开连接
      tsplConnectionClient.disconnect();
      // 关闭连接客户端
      tsplConnectionClient.shutdown();
    }
  }

}
