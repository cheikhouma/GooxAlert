import 'package:flutter/material.dart';

class NotificationStyles {
  // Couleurs pour différents types de notifications
  static const Color dangerColor = Color(0xFFE53935);
  static const Color warningColor = Color(0xFFFFA000);
  static const Color successColor = Color(0xFF43A047);
  static const Color infoColor = Color(0xFF1E88E5);
  static const Color neutralColor = Color(0xFF757575);

  // Style pour le conteneur principal de la notification
  static BoxDecoration getNotificationDecoration({
    required Color color,
    bool isRead = false,
  }) {
    return BoxDecoration(
      color: isRead ? Colors.grey[100] : Colors.white,
      borderRadius: BorderRadius.circular(12),
      boxShadow: [
        BoxShadow(
          color: color.withOpacity(0.1),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ],
      border: Border.all(
        color: isRead ? Colors.grey[300]! : color.withOpacity(0.3),
        width: 1,
      ),
    );
  }

  // Style pour le titre de la notification
  static TextStyle getTitleStyle({bool isRead = false}) {
    return TextStyle(
      fontSize: 16,
      fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
      color: isRead ? Colors.grey[600] : Colors.black87,
    );
  }

  // Style pour le message de la notification
  static TextStyle getMessageStyle({bool isRead = false}) {
    return TextStyle(
      fontSize: 14,
      color: isRead ? Colors.grey[600] : Colors.black54,
    );
  }

  // Style pour l'horodatage
  static TextStyle getTimestampStyle() {
    return TextStyle(
      fontSize: 12,
      color: Colors.grey[500],
    );
  }

  // Style pour le badge de statut
  static BoxDecoration getStatusBadgeDecoration(Color color) {
    return BoxDecoration(
      color: color.withOpacity(0.1),
      borderRadius: BorderRadius.circular(4),
      border: Border.all(
        color: color.withOpacity(0.3),
        width: 1,
      ),
    );
  }

  // Style pour le texte du badge de statut
  static TextStyle getStatusBadgeTextStyle(Color color) {
    return TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      color: color,
    );
  }

  // Style pour le bouton d'action
  static ButtonStyle getActionButtonStyle(Color color) {
    return TextButton.styleFrom(
      foregroundColor: color,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: color.withOpacity(0.3)),
      ),
    );
  }
}

// Widget réutilisable pour les notifications
class NotificationCard extends StatelessWidget {
  final String title;
  final String message;
  final DateTime timestamp;
  final String status;
  final bool isRead;
  final VoidCallback? onTap;
  final VoidCallback? onAction;

  const NotificationCard({
    Key? key,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.status,
    this.isRead = false,
    this.onTap,
    this.onAction,
  }) : super(key: key);

  Color _getStatusColor() {
    switch (status.toLowerCase()) {
      case 'danger':
        return NotificationStyles.dangerColor;
      case 'warning':
        return NotificationStyles.warningColor;
      case 'success':
        return NotificationStyles.successColor;
      case 'info':
        return NotificationStyles.infoColor;
      default:
        return NotificationStyles.neutralColor;
    }
  }

  String _getTimeAgo() {
    final difference = DateTime.now().difference(timestamp);
    if (difference.inDays > 0) {
      return '${difference.inDays}j';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'À l\'instant';
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: NotificationStyles.getNotificationDecoration(
            color: statusColor,
            isRead: isRead,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: NotificationStyles.getTitleStyle(isRead: isRead),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: NotificationStyles.getStatusBadgeDecoration(statusColor),
                    child: Text(
                      status.toUpperCase(),
                      style: NotificationStyles.getStatusBadgeTextStyle(statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                message,
                style: NotificationStyles.getMessageStyle(isRead: isRead),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _getTimeAgo(),
                    style: NotificationStyles.getTimestampStyle(),
                  ),
                  if (onAction != null)
                    TextButton(
                      onPressed: onAction,
                      style: NotificationStyles.getActionButtonStyle(statusColor),
                      child: const Text('Voir détails'),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
} 