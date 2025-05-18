import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('À propos')),
      body: Center(child: Text('À propos de l\'application')), 
    );
  }
} 