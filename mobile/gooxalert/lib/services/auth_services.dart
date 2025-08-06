import 'dart:convert';
import 'package:gooxalert/models/signalements.dart';
import 'package:gooxalert/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Modèles de données
class RegisterData {
  final String fullName;
  final String telephone;
  final String commune;
  final String password;

  RegisterData({
    required this.fullName,
    required this.telephone,
    required this.commune,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
        'full_name': fullName,
        'telephone': telephone,
        'commune': commune,
        'password': password,
      };
}

class LoginData {
  final String telephone;
  final String password;

  LoginData({
    required this.telephone,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
        'telephone': telephone,
        'password': password,
      };
}

class AuthService {
  static const String baseUrl = 'http://192.168.137.151:8000';
  static final _client = http.Client();

  static Map<String, String> _defaultHeaders() => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // Méthode de récupération du token d'accès
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }

  // Méthode de récupération des données utilisateur
  static Future<UserModel?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('userData');
    if (userData == null) return null;
    return UserModel.fromJson(jsonDecode(userData));
  }

// Méthode de récupération des signalements de l'utilisateur
  static Future<List<SignalementModel>?> getUserSignalements() async {
    final prefs = await SharedPreferences.getInstance();
    final userSignalements = prefs.getString('userSignalements');
    if (userSignalements == null) return null;

    final List<dynamic> parsedJson = jsonDecode(userSignalements);
    return parsedJson.map((json) => SignalementModel.fromJson(json)).toList();
  }

  // Méthode d'inscription
  static Future<Map<String, dynamic>> register(RegisterData data) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/auth/api/register/'),
      headers: _defaultHeaders(),
      body: jsonEncode(data.toJson()),
    );

    if (response.statusCode != 201 && response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      if (errorData is Map<String, dynamic>) {
        if (errorData.containsKey('non_field_errors')) {
          throw Exception(errorData['non_field_errors'][0]);
        }
        final errors = errorData.entries
            .where((e) => e.value is List)
            .map((e) => '${e.key}: ${(e.value as List).first}')
            .join('\n');
        if (errors.isNotEmpty) {
          throw Exception(errors);
        }
      }
      throw Exception('Erreur d\'inscription: ${response.statusCode}');
    }

    return jsonDecode(response.body);
  }

  // Méthode de connexion (authentification JWT via /api/token/)
  static Future<UserModel> login(LoginData data) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/auth/api/login/'),
      headers: _defaultHeaders(),
      body: jsonEncode(data.toJson()),
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      if (errorData is Map<String, dynamic> &&
          errorData.containsKey('detail')) {
        throw Exception(errorData['detail']);
      }
      throw Exception('Identifiants invalides');
    }

    final responseData = jsonDecode(response.body);
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString('accessToken', responseData['tokens']['access']);
    await prefs.setString('refreshToken', responseData['tokens']['refresh']);
    await prefs.setString('userData', jsonEncode(responseData['user']));
    await prefs.setString(
        "userSignalements", jsonEncode(responseData['signalements']));

    return UserModel.fromJson(responseData['user']);
  }

  // Vérification du numéro de téléphone
  static Future<Map<String, dynamic>> checkPhone(String telephone) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/auth/api/demande-reinitialisation/'),
      headers: _defaultHeaders(),
      body: jsonEncode({'telephone': telephone}),
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      if (errorData is Map<String, dynamic> &&
          errorData.containsKey('detail')) {
        throw Exception(errorData['detail']);
      }
      throw Exception('Erreur lors de la vérification du numéro');
    }

    return jsonDecode(response.body);
  }

  // Réinitialisation du mot de passe
  static Future<Map<String, dynamic>> resetPassword(
      String telephone, String newPassword) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/auth/api/reinitialiser-mot-de-passe/'),
      headers: _defaultHeaders(),
      body: jsonEncode({
        'telephone': telephone,
        'new_password': newPassword,
      }),
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      if (errorData is Map<String, dynamic> &&
          errorData.containsKey('detail')) {
        throw Exception(errorData['detail']);
      }
      throw Exception('Erreur lors de la réinitialisation du mot de passe');
    }

    return jsonDecode(response.body);
  }

  // Déconnexion : supprime tokens localement (pas d’appel backend nécessaire avec JWT standard)
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
    await prefs.remove('refreshToken');
  }

  // Vérifier si l'utilisateur est connecté
  static Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString('accessToken');
    return accessToken != null;
  }
}
