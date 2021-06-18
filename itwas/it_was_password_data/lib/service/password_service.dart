import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:say_what_file_password/constant.dart';

class PasswordService{
  static final PasswordService _checkOldPasswordService = PasswordService._internal();

  factory PasswordService(){
    return _checkOldPasswordService;
  }

  PasswordService._internal();

  final _urlPasswordReset = Uri.parse(DATA_SERVER_URL + "/password");
  // final _result404 = '404';

  // bool _isOldPasswordOK = false;

  final headers = <String, String>{'Content-Type': 'application/json; charset=UTF-8',};

  Map<String, dynamic> body(String oldPassword,  content){
    return {
      'password': oldPassword, 'content': content
    };
  }

  Future<http.Response> post(Map<String, dynamic> bodyContent) async{
    return await http.post(_urlPasswordReset, body: jsonEncode( bodyContent), headers: headers);
  }

  bool is404(String body){
    if (body == RESULT404) return true;

    return false;
  }
//
// void decode(String body){
//   var jso = jsonDecode(body);
// }
}