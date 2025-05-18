import 'package:flutter/material.dart';
import 'login.dart';
import 'navigation/signalements.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GooxAlert',
      theme: AppTheme.themeData,
      home: Login(),
      routes: {
        '/signalements': (context) => Signalements(),
      },
    );
  }
}
