import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class SignalementDetailPage extends StatelessWidget {
  final String category;
  final String title;
  final String description;
  final String image;
  final String date;
  final String author;
  final LatLng position;

  const SignalementDetailPage({
    required this.category,
    required this.title,
    required this.description,
    required this.image,
    required this.date,
    required this.author,
    required this.position,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F7F3),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: BackButton(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.lightbulb_outline, color: Color(0xFF89BDB8)),
                SizedBox(width: 8),
                Text(category, style: TextStyle(fontSize: 16, color: Color(0xFF89BDB8))),
              ],
            ),
            SizedBox(height: 12),
            Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
            SizedBox(height: 16),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(image, height: 160, width: double.infinity, fit: BoxFit.cover),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(description, style: TextStyle(fontSize: 15)),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.calendar_today, size: 16),
                      SizedBox(width: 6),
                      Text(date, style: TextStyle(fontSize: 13)),
                      SizedBox(width: 18),
                      Icon(Icons.person, size: 16),
                      SizedBox(width: 6),
                      Text(author, style: TextStyle(fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 18),
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: SizedBox(
                height: 160,
                child: FlutterMap(
                  options: MapOptions(
                    initialCenter: position,
                    initialZoom: 16,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.example.gooxalert',
                    ),
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: position,
                          width: 48,
                          height: 48,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                              boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                            ),
                            child: Center(
                              child: Icon(Icons.lightbulb_outline, color: Colors.white, size: 24),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
} 