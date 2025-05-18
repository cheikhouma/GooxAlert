import 'package:flutter/material.dart';
import 'home.dart';
import 'signaler.dart';
import 'signalements.dart';
import 'app_drawer.dart';

class NavigationPage extends StatefulWidget {
  @override
  State<NavigationPage> createState() => _NavigationPageState();
}

class _NavigationPageState extends State<NavigationPage> {
  
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    Home(),
    Signaler(),
    Signalements(),
  ];

  Widget navIcon(IconData icon, bool selected) {
    return Container(
      decoration: selected
          ? BoxDecoration(
              color: Color(0xFF89BDB8),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
                bottomLeft: Radius.circular(10),
                bottomRight: Radius.circular(10),
              ),
              border: Border.all(color: Color(0xFF3B6C5C), width: 0),
            )
          : null,
      padding: selected
          ? const EdgeInsets.symmetric(horizontal: 22, vertical: 6)
          : const EdgeInsets.all(10),
      child: Icon(
        icon,
        size: 25,
        color: Colors.black,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Color(0xFFF9F7F3),
        automaticallyImplyLeading: false,
      ),
      drawer: AppDrawer(),
      body: Stack(
        children: [
          _pages[_selectedIndex],
          Positioned(
            top: 0,
            right: 24,
            child: Builder(
              builder: (context) => GestureDetector(
                onTap: () => Scaffold.of(context).openDrawer(),
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 8,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Icon(Icons.menu, size: 28, color: Colors.black),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        backgroundColor: const Color(0xFFFFFFFF),
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 14,
          color: Color(0xFF000000),
        ),
        unselectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 14,
          color: Color(0xFF000000),
        ),
        items: [
          BottomNavigationBarItem(
            icon: navIcon(Icons.home_outlined, _selectedIndex == 0),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: navIcon(Icons.add_box_outlined, _selectedIndex == 1),
            label: 'Signaler',
          ),
          BottomNavigationBarItem(
            icon: navIcon(Icons.assignment_outlined, _selectedIndex == 2),
            label: 'Signalements',
          ),
        ],
      ),
    );
  }
}