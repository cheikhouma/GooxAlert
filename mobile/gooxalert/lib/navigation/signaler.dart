import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gooxalert/models/signalements.dart';
import 'package:gooxalert/models/user.dart';
import 'package:gooxalert/services/auth_services.dart';
import 'package:gooxalert/services/issue_context.dart';
import 'package:gooxalert/widgets/set_location.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

class Signaler extends StatefulWidget {
  const Signaler({super.key});

  @override
  _SignalerState createState() => _SignalerState();
}

class _SignalerState extends State<Signaler> {
  String? selectedCategory = 'Lumière';
  final List<String> categories = [
    'Lumière',
    'Voirie',
    'Déchets',
    'Eau',
    'Autre'
  ];

  File? _imageFile;
  Position? _position;
  LatLng? _selectedLatLng;

  UserModel? _user;

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  bool _isSubmitting = false;
  String? _error;

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
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) return;

    final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    setState(() {
      _position = pos;
      _selectedLatLng = LatLng(pos.latitude, pos.longitude);
    });
  }

  @override
  void initState() {
    super.initState();
    AuthService.getCurrentUser().then((user) {
      setState(() {
        _user = user;
      });
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

  Future<void> _submitSignalement() async {
    if (_titleController.text.isEmpty ||
        _descriptionController.text.isEmpty ||
        selectedCategory == null ||
        _selectedLatLng == null) {
      setState(() {
        _error = 'Tous les champs obligatoires doivent être remplis.';
      });
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    try {
      final token = await AuthService.getToken();
      String? imageUrl;

      if (_imageFile != null) {
        imageUrl = await uploadImageToImgBB(_imageFile!);
      }

      final SignalementModel issueData = SignalementModel(
        id: 0, // valeur temporaire, sera écrasée par le backend
        title: _titleController.text,
        description: _descriptionController.text,
        imageUrl: imageUrl ?? '',
        location: '${_selectedLatLng!.latitude},${_selectedLatLng!.longitude}',
        category: selectedCategory!,
        status:
            'en_attente', // valeur initiale logique, à ajuster selon ton backend
        createdAt: DateTime.now(), // valeur locale temporaire
        user: _user!.id,
      );

      if (token == null) {
        setState(() {
          _error = 'Votre session a expiré. Veuillez vous reconnecter.';
          _isSubmitting = false;
        });
        return;
      }

      await addIssue(
        issueData,
        token,
        (bool refresh) async {},
        (String? err) => setState(() => _error = err),
      );

      Navigator.of(context).pop(true);
    } catch (e) {
      setState(() => _error = 'Erreur : ${e.toString()}');
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 255, 255),
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
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 10,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Titre', style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  TextField(
                    controller: _titleController,
                    decoration: InputDecoration(
                      hintText: "Exemple: lampadaire cassée sur l'avenue...",
                    ),
                  ),
                  SizedBox(height: 24),
                  Text('Catégorie',
                      style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: selectedCategory,
                    decoration: InputDecoration(),
                    items: categories
                        .map((cat) => DropdownMenuItem(
                              value: cat,
                              child: Text(cat),
                            ))
                        .toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedCategory = value;
                      });
                    },
                  ),
                  SizedBox(height: 24),
                  Text('Description',
                      style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 8),
                  TextField(
                    controller: _descriptionController,
                    minLines: 4,
                    maxLines: 6,
                    decoration: InputDecoration(),
                  ),
                  SizedBox(height: 24),
                  Text('Localisation',
                      style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _getCurrentLocation,
                          icon: Icon(Icons.location_on_outlined,
                              color: Colors.black),
                          label: Text('votre position',
                              style: TextStyle(color: Colors.black)),
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
                          label: Text('voir carte',
                              style: TextStyle(color: Colors.black)),
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
                      child: Text(
                        'Position: ${_selectedLatLng!.latitude.toStringAsFixed(5)}, ${_selectedLatLng!.longitude.toStringAsFixed(5)}',
                        style: TextStyle(color: Colors.black54),
                      ),
                    ),
                  SizedBox(height: 24),
                  Text('Ajouter une photo',
                      style: Theme.of(context).textTheme.titleMedium),
                  SizedBox(height: 12),
                  GestureDetector(
                    onTap: _pickImage,
                    child: Container(
                      width: double.infinity,
                      height: 120,
                      decoration: BoxDecoration(
                        border: Border.all(
                            color: Theme.of(context).colorScheme.primary,
                            style: BorderStyle.solid,
                            width: 1),
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.transparent,
                      ),
                      child: _imageFile == null
                          ? Center(
                              child: Icon(Icons.photo_camera_outlined,
                                  size: 40,
                                  color: Theme.of(context).colorScheme.primary))
                          : ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(_imageFile!,
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                  height: 120),
                            ),
                    ),
                  ),
                  SizedBox(height: 16),
                  if (_error != null)
                    Text(_error!, style: TextStyle(color: Colors.red)),
                  SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _submitSignalement,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.error,
                        foregroundColor: Colors.white,
                        textStyle: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 18),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: _isSubmitting
                          ? CircularProgressIndicator(color: Colors.white)
                          : Text('Soumettre'),
                    ),
                  ),
                  SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
