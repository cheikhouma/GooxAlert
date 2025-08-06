import 'package:flutter/material.dart';
import 'package:gooxalert/navigation/signalements/signalements_carte.dart';
import 'package:gooxalert/navigation/signalements/signalements_liste.dart';
import 'package:gooxalert/widgets/toggle_button.dart';

class Signalements extends StatefulWidget {
  const Signalements({super.key});

  @override
  _SignalementsState createState() => _SignalementsState();
}

class _SignalementsState extends State<Signalements> {
  bool showMap = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9F7F3),
      drawer: Drawer(
        child: Center(child: Text("Menu ici")),
      ),
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  ToggleButton(
                    icon: Icons.location_on_outlined,
                    selected: showMap,
                    onTap: () => setState(() => showMap = true),
                  ),
                  SizedBox(width: 8),
                  ToggleButton(
                    icon: Icons.list_alt,
                    selected: !showMap,
                    onTap: () => setState(() => showMap = false),
                  ),
                  Spacer(),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: showMap ? SignalementsCarte() : SignalementsListe(),
            ),
          ],
        ),
      ),
    );
  }
}
