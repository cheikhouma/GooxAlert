import 'package:flutter/material.dart';
import '../theme/notification_styles.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all),
            onPressed: () {
              // Marquer toutes les notifications comme lues
            },
          ),
        ],
      ),
      body: ListView(
        children: [
          NotificationCard(
            title: 'Signalement traité',
            message: 'Votre signalement "Lampadaire cassé" a été traité par les autorités.',
            timestamp: DateTime(2024, 3, 20, 14, 55),
            status: 'résolu',
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Signalement en cours',
            message: 'Les autorités sont en route pour le signalement #1235.',
            timestamp: DateTime(2024, 3, 20, 12, 0),
            status: 'en cours',
            isRead: true,
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Nouveau signalement',
            message: 'Un nouveau signalement a été créé dans votre zone.',
            timestamp: DateTime(2024, 3, 20, 9, 0),
            status: 'nouveau',
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Signalement rejeté',
            message: 'Le signalement #1236 a été rejeté car il ne respecte pas les critères.',
            timestamp: DateTime(2024, 3, 20, 6, 0),
            status: 'rejeté',
            isRead: true,
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Mise à jour de statut',
            message: 'Le signalement #1237 a été mis à jour : Enquête en cours.',
            timestamp: DateTime(2024, 3, 19, 14, 0),
            status: 'en cours',
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Signalement résolu',
            message: 'Le signalement #1238 a été résolu avec succès.',
            timestamp: DateTime(2024, 3, 19, 10, 0),
            status: 'résolu',
            isRead: true,
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
          NotificationCard(
            title: 'Nouveau signalement',
            message: 'Un nouveau signalement a été créé dans votre zone.',
            timestamp: DateTime(2024, 3, 18, 16, 0),
            status: 'nouveau',
            onAction: () {
              // Navigation vers les détails du signalement
            },
          ),
        ],
      ),
    );
  }
} 