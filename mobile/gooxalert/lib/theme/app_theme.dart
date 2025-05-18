import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFFB3D5D1);
  static const Color accent = Color(0xFF89BDB8);
  static const Color background = Color(0xFFF9F7F3);
  static const Color card = Colors.white;
  static const Color text = Colors.black;
  static const Color textSecondary = Colors.black54;
  static const Color error = Colors.red;
}

class AppTheme {
  static ThemeData get themeData => ThemeData(
    scaffoldBackgroundColor: AppColors.background,
    primaryColor: AppColors.primary,
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
    useMaterial3: true,
    fontFamily: 'Roboto',
    textTheme: const TextTheme(
      headlineSmall: TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: AppColors.text),
      titleMedium: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.text),
      bodyMedium: TextStyle(fontSize: 15, color: AppColors.text),
      bodySmall: TextStyle(fontSize: 13, color: AppColors.textSecondary),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.card,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.primary, width: 1),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.primary, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.accent, width: 2),
      ),
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      prefixIconColor: AppColors.accent,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.text,
        textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 14),
      ),
    ),
    cardTheme: CardTheme(
      color: AppColors.card,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
    ),
  );
} 