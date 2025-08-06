import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gooxalert/models/signalements.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

const String apiUrl = 'http://192.168.137.151:8000/signalement';

Future<String> uploadImageToImgBB(File imageFile) async {
  final apiKey = '49a117f96f4b6126c8c616a07f23eb06';
  final uri = Uri.parse('https://api.imgbb.com/1/upload?key=$apiKey');

  final request = http.MultipartRequest('POST', uri);
  request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

  final response = await request.send();
  final responseBody = await response.stream.bytesToString();
  final decoded = json.decode(responseBody);

  if (decoded['success'] == true) {
    return decoded['data']['url'];
  } else {
    throw Exception(
        "Erreur lors de l'upload de l'image : ${decoded['error']['message']}");
  }
}

Future<Map<String, dynamic>> addIssue(
  SignalementModel issueData,
  String token,
  Future<void> Function(bool) fetchIssues,
  void Function(String?) setError,
) async {
  try {
    setError(null);
    final response = await http.post(
      Uri.parse('$apiUrl/api/signalement/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(issueData),
    );
    print(jsonEncode(issueData));
    debugPrint('Response body: ${response.body}');

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final newIssue = jsonDecode(response.body);
      await fetchIssues(true);
      return newIssue;
    } else {
      setError('Erreur lors de l\'ajout du signalement');
      throw Exception('Failed with status ${response.statusCode}');
    }
  } catch (err) {
    setError('Erreur lors de l\'ajout du signalement');
    rethrow;
  }
}

Future<void> updateIssue(
  int issueId,
  Map<String, dynamic> issueData,
  String token,
  Future<void> Function(bool) fetchIssues,
  void Function(String?) setError,
) async {
  try {
    setError(null);
    final response = await http.put(
      Uri.parse('$apiUrl/api/signalement/$issueId/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(issueData),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      await fetchIssues(true);
    } else {
      setError('Erreur lors de la mise à jour du signalement');
      throw Exception('Failed with status ${response.statusCode}');
    }
  } catch (err) {
    setError('Erreur lors de la mise à jour du signalement');
    rethrow;
  }
}

Future<void> deleteIssue(
  int issueId,
  String token,
  Future<void> Function(bool) fetchIssues,
  void Function(String?) setError,
) async {
  try {
    setError(null);
    final response = await http.delete(
      Uri.parse('$apiUrl/api/signalement/$issueId/'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      await fetchIssues(true);
    } else {
      setError('Erreur lors de la suppression du signalement');
      throw Exception('Failed with status ${response.statusCode}');
    }
  } catch (err) {
    setError('Erreur lors de la suppression du signalement');
    rethrow;
  }
}
