import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'dart:io';

class Signaler extends StatefulWidget {
  @override
  _SignalerState createState() => _SignalerState();
}

class _SignalerState extends State<Signaler> {
  String? selectedCategory = 'Lumière';
  final List<String> categories = [
    'Lumière', 'Voirie', 'Déchets', 'Eau', 'Autre'
  ];

  File? _imageFile;
  Position? _position;
  LatLng? _selectedLatLng;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
      });
    }
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return;
    }
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return;
    }
    final pos = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    setState(() {
      _position = pos;
      _selectedLatLng = LatLng(pos.latitude, pos.longitude);
    });
  }

  Future<void> _openMapToSelectPoint() async {
    final LatLng? result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SelectLocationPage(
          initialPosition: _selectedLatLng ?? LatLng(14.764504, -17.366029),
        ),
      ),
    );
    if (result != null) {
      setState(() {
        _selectedLatLng = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9F7F3),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(left: 16, right: 16, top: 60),
          child: Center(
            child: Container(
              width: double.infinity,
              constraints: BoxConstraints(maxWidth: 400),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              padding: EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Titre
                  Text('Titre', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  TextField(
                    decoration: InputDecoration(
                      hintText: "Exemple: lampadaire cassée sur l'avenue...",
                    ),
                  ),
                  SizedBox(height: 24),
                  // Catégorie
                  Text('Catégorie', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: selectedCategory,
                    decoration: InputDecoration(),
                    items: categories.map((cat) => DropdownMenuItem(
                      value: cat,
                      child: Text(cat),
                    )).toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedCategory = value;
                      });
                    },
                  ),
                  SizedBox(height: 24),
                  // Description
                  Text('Description', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  TextField(
                    minLines: 4,
                    maxLines: 6,
                    decoration: InputDecoration(),
                  ),
                  SizedBox(height: 24),
                  // Localisation
                  Text('Localisation', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _getCurrentLocation,
                          icon: Icon(Icons.location_on_outlined, color: Colors.black),
                          label: Text('votre position', style: TextStyle(color: Colors.black)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFB3D5D1),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _openMapToSelectPoint,
                          icon: Icon(Icons.map_outlined, color: Colors.black),
                          label: Text('voir carte', style: TextStyle(color: Colors.black)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFB3D5D1),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (_selectedLatLng != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text('Position: ${_selectedLatLng!.latitude.toStringAsFixed(5)}, ${_selectedLatLng!.longitude.toStringAsFixed(5)}', style: TextStyle(color: Colors.black54)),
                    ),
                  SizedBox(height: 24),
                  // Ajouter une photo
                  Text('Ajouter une photo', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 12),
                  GestureDetector(
                    onTap: _pickImage,
                    child: Container(
                      width: double.infinity,
                      height: 120,
                      decoration: BoxDecoration(
                        border: Border.all(color: Theme.of(context).colorScheme.primary, style: BorderStyle.solid, width: 1),
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.transparent,
                      ),
                      child: _imageFile == null
                          ? Center(child: Icon(Icons.photo_camera_outlined, size: 40, color: Theme.of(context).colorScheme.primary))
                          : ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(_imageFile!, fit: BoxFit.cover, width: double.infinity, height: 120),
                            ),
                    ),
                  ),
                  SizedBox(height: 32),
                  // Bouton soumettre
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.error,
                        foregroundColor: Colors.white,
                        textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text('Soumettre'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Nouvelle page pour sélectionner un point sur la carte
class SelectLocationPage extends StatefulWidget {
  final LatLng initialPosition;
  const SelectLocationPage({required this.initialPosition});

  @override
  State<SelectLocationPage> createState() => _SelectLocationPageState();
}

class _SelectLocationPageState extends State<SelectLocationPage> {
  LatLng? _pickedPoint;

  @override
  void initState() {
    super.initState();
    _pickedPoint = widget.initialPosition;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Choisir un point sur la carte', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        iconTheme: IconThemeData(color: Colors.black),
        elevation: 1,
      ),
      body: FlutterMap(
        options: MapOptions(
          initialCenter: _pickedPoint!,
          initialZoom: 15.0,
          onTap: (tapPosition, latlng) {
            setState(() {
              _pickedPoint = latlng;
            });
          },
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            userAgentPackageName: 'com.example.gooxalert',
          ),
          if (_pickedPoint != null)
            MarkerLayer(
              markers: [
                Marker(
                  point: _pickedPoint!,
                  width: 40,
                  height: 40,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                    ),
                    child: Center(
                      child: Icon(Icons.location_on, color: Colors.white, size: 24),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFF89BDB8),
              foregroundColor: Colors.black,
              padding: EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(context, _pickedPoint);
            },
            child: Text('Valider ce point', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ),
      ),
    );
  }
}
