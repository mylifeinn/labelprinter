package com.gdlinkjob.labelprinter.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.fintrace.core.drivers.tspl.commands.label.BarcodeRotation;
import org.fintrace.core.drivers.tspl.commands.label.ErrorCorrectionLevel;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintRequest {
  private String venderId;
  private String productId;
  private int cellWidth;
  private ErrorCorrectionLevel errorCorrectionLevel;
  private BarcodeRotation rotation;
  private int nbLabels;
  private double dots;
  private float labelDistance;
  private float labelWidth;
  private float labelLength;
  private double qrcodeX;
  private double qrcodeY;
  private String data;
  private String[] dataMatches;
  private String url;
  private String regex;
  private float textStringX;
  private float textStringY;
  private String textStringType;
  private float multipliCationX;
  private float multipliCationY;
  private String textString;
  private int fontDots;
}

