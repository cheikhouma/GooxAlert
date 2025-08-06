class SignalementModel {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final String location;
  final String category;
  final String status;
  final DateTime createdAt;
  final int user;

  SignalementModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.location,
    required this.category,
    required this.status,
    required this.createdAt,
    required this.user,
  });

  factory SignalementModel.fromJson(Map<String, dynamic> json) {
    return SignalementModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['image_url'],
      location: json['location'],
      category: json['category'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      user: json['user'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'image_url': imageUrl,
      'location': location,
      'category': category,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'user': user,
    };
  }
}
