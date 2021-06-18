import 'package:flutter/material.dart';
import 'package:say_what_file_password/constant.dart';

class OldPassword extends StatefulWidget {
  final double maxWidth;
  final void Function(String)? onChanged;

  const OldPassword({Key? key, this.maxWidth = 200.0, this.onChanged}) : super(key: key);

  @override
  _OldPasswordState createState() => _OldPasswordState();
}

class _OldPasswordState extends State<OldPassword> {
  String? _oldPassword;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(maxWidth: widget.maxWidth),
      child: TextField(
        obscureText: true,
        decoration: InputDecoration(
            border: OutlineInputBorder(), labelText: '密碼'),
        onChanged: _onChanged,
      ),
    );
  }

  void _onChanged(String password){
    _oldPassword = password;
    if ( _oldPassword!.length > PASSWORD_MIN_LENGTH && widget.onChanged !=null)
      widget.onChanged!(password);
  }

}
