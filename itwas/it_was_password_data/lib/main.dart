import 'dart:typed_data';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';
import 'package:say_what_file_password/constant.dart';
import 'package:say_what_file_password/d/long_file_picker.dart';
import 'package:say_what_file_password/d/old_password.dart';
import 'package:say_what_file_password/d/new_password.dart';
import 'package:say_what_file_password/func/long_dialog.dart';
import 'package:say_what_file_password/service/file_pick_service.dart';
import 'package:say_what_file_password/service/password_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'what a',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'data file update'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final _passwordService = PasswordService();
  final _filePickerService = FilePickerService();

  final _maxWidth = 400.0;

  String? _newPassword;
  String? _oldPassword;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        // child: Row(
        //   mainAxisSize: MainAxisSize.min,
        //   crossAxisAlignment: CrossAxisAlignment.start,
        //   children: [
        //     // OldPassword(
        //     //   maxWidth: _maxWidth,
        //     //   onChanged: _onChangedOldPassword,
        //     // ),
          child:  Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                OldPassword(
                  maxWidth: _maxWidth,
                  onChanged: _onChangedOldPassword,
                ),
                Container(width: 50,height: 30,),
                Column(
                  children: [
                NewPassword(
                  maxWidth: _maxWidth,
                  checkOrReset: _onCheckOrReset,
                ),
                Container(width: 50,height: 20,),
                LongFilePicker(
                  onFilePicked: _onFileUpdate,
                ),
                ])
              ],
            ),
          // ],
        ),
      // ),
    );
  }

  void _onChangedOldPassword(String password) {
    _oldPassword = password;
  }

  void _onCheckOrReset(String newPassword) {
    _newPassword = newPassword;

    if (_oldPassword == null || _oldPassword!.length < PASSWORD_MIN_LENGTH)
      return;

    _postPassword(_newPassword!);
  }

  Future<void> _postPassword(String newPassword) async {
    final sendBody = _passwordService.body(_oldPassword!, newPassword);
    final result = await _passwordService.post(sendBody);
    final resBody = result.body;

    if (_passwordService.is404(resBody)) {
      longDialog(context, content1: 'reset failed', showCancel: false);
    } else {
      longDialog(context, content1: 'reset success', showCancel: false);
    }
  }

  void _onFileUpdate(Uint8List files) {
    if (_oldPassword == null || _oldPassword!.length < PASSWORD_MIN_LENGTH)
      return;

    final request = _filePickerService.request(files, _oldPassword!);

    _send(request);
  }

  Future _send(MultipartRequest request) async {
    _filePickerService.send(context, request);
  }
}
