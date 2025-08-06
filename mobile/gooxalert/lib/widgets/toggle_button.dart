import 'package:flutter/material.dart';

class ToggleButton extends StatefulWidget {
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const ToggleButton({
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  State<ToggleButton> createState() => _ToggleButtonState();
}

class _ToggleButtonState extends State<ToggleButton> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: widget.selected ? Color(0xFFB3D5D1) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white, width: 2),
        ),
        child: Icon(widget.icon,
            color: widget.selected ? Colors.black : Colors.black54),
      ),
    );
  }
}
