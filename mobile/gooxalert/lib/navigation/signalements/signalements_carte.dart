import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:gooxalert/models/signalements.dart';
import 'package:gooxalert/models/user.dart';
import 'package:gooxalert/navigation/signalement_detail.dart';
import 'package:gooxalert/services/auth_services.dart';
import 'package:latlong2/latlong.dart';

class SignalementsCarte extends StatefulWidget {
  @override
  State<SignalementsCarte> createState() => _SignalementsCarteState();
}

class _SignalementsCarteState extends State<SignalementsCarte> {
  void _showReportSummary(SignalementModel report) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(18.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.lightbulb_outline, color: Color(0xFF89BDB8)),
                  SizedBox(width: 8),
                  Text(report.category,
                      style: TextStyle(fontSize: 15, color: Color(0xFF89BDB8))),
                ],
              ),
              SizedBox(height: 8),
              Text(report.title,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              SizedBox(height: 8),
              Text(report.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 14)),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 15),
                  SizedBox(width: 6),
                  Text(report.createdAt.toString(),
                      style: TextStyle(fontSize: 13)),
                  SizedBox(width: 18),
                  Icon(Icons.person, size: 15),
                ],
              ),
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB3D5D1),
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                        elevation: 0,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => SignalementDetailPage(
                              category: report.category,
                              title: report.title,
                              description: report.description,
                              image: report.imageUrl,
                              date: report.createdAt.toString(),
                              author: "Par vous",
                              position: LatLng(
                                  double.parse(report.location.split(',')[0]),
                                  double.parse(report.location.split(',')[1])),
                            ),
                          ),
                        );
                      },
                      child: Text('Détails'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  UserModel? _user;
  List<SignalementModel>? _signalements;

  @override
  void initState() {
    super.initState();
    AuthService.getCurrentUser().then((user) {
      setState(() {
        _user = user;
      });
    });
    AuthService.getUserSignalements().then((signalements) {
      setState(() {
        _signalements = signalements;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(14.764504, -17.366029),
        initialZoom: 8.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.example.gooxalert',
        ),
        MarkerLayer(
          markers: _signalements?.map((signalement) {
                final coords = signalement.location.split(',');
                return Marker(
                  point:
                      LatLng(double.parse(coords[0]), double.parse(coords[1])),
                  width: 40,
                  height: 40,
                  child: GestureDetector(
                    onTap: () => _showReportSummary(signalement),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(color: Colors.black26, blurRadius: 4)
                        ],
                      ),
                      child: Center(
                        child: Icon(Icons.lightbulb_outline,
                            color: Colors.white, size: 22),
                      ),
                    ),
                  ),
                );
              }).toList() ??
              [],
        )
      ],
    );
  }
}
