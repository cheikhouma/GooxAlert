class UserModel {
  final int id;
  final String fullName;
  final String telephone;
  final String commune;
  final String imageUrl;
  final String role;

  UserModel({
    required this.id,
    required this.fullName,
    required this.telephone,
    required this.commune,
    required this.imageUrl,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      fullName: json['full_name'],
      telephone: json['telephone'],
      commune: json['commune'],
      imageUrl: json['image_url'],
      role: json['role'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'telephone': telephone,
      'commune': commune,
      'image_url': imageUrl,
      'role': role,
    };
  }
}
