
import 'package:flutter/material.dart';
import 'package:say_what_file_password/constant.dart';
import 'package:say_what_file_password/func/long_dialog.dart';

class NewPassword extends StatefulWidget {
  final double maxWidth;
  final void Function(String)? checkOrReset;

  const NewPassword({Key? key, this.maxWidth = 200.0, this.checkOrReset})
      : super(key: key);

  @override
  _NewPasswordState createState() => _NewPasswordState();
}

class _NewPasswordState extends State<NewPassword> {

  String? _newPassword;
  String? _passwordAgain;
  bool _sameNewPassword = false;
  bool _notLongEnough = true;

  @override
  Widget build(BuildContext context) {
    // return Container();
    return Container(
      // width: widget.maxWidth,
      constraints: BoxConstraints(maxWidth: widget.maxWidth),
      child: Column(children: [
        TextField(
          obscureText: true,
          decoration:
              InputDecoration(border: OutlineInputBorder(), labelText: '新密碼'),
          onChanged: _onNewPassword,
        ),
        TextField(
          obscureText: true,
          decoration:
              InputDecoration(border: OutlineInputBorder(), labelText: '再新密碼'),
          onChanged: (p) => _onNewPasswordAgain(p),
        ),
        ElevatedButton(
            onPressed: _onPasswordReset, child: Text('password reset')),
      ]),
    );
  }

  void _onNewPassword(String password) {
    _checkPassword(false, password, _passwordAgain);
  }

  void _checkPassword(bool isAgain, String password, String? checkedPassword) {
    final passwordTrim = password.trim();

    if (isAgain) {
      _passwordAgain = passwordTrim;
    } else {
      _newPassword = passwordTrim;
    }

    _sameNewPassword = false;
    _notLongEnough = false;

        if (passwordTrim.length < PASSWORD_MIN_LENGTH) {

      _notLongEnough = true;
    }

    if (checkedPassword == passwordTrim) {
      _sameNewPassword = true;
    }
  }

  void _onNewPasswordAgain(String password) {
    _checkPassword(true, password, _newPassword);
  }

  void _onPasswordReset() {
    if (_sameNewPassword && !_notLongEnough && widget.checkOrReset != null) {
      longDialog(context, onPressed: _onPressed);
    }
  }

  void _onPressed(bool isConfirm){
    if (isConfirm){
      widget.checkOrReset!(_newPassword!);

    }
  }
}
