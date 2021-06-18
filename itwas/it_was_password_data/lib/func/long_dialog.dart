import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

Future<void> longDialog(BuildContext context,
    {String title = 'Alert',
    String content1 = 'are you sure?',
    String? content2,
    bool showCancel = true,
    Function(bool)? onPressed}) async {
  return showDialog<void>(
    context: context,
    barrierDismissible: false, // user must tap button!
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text(title),
        content: SingleChildScrollView(
          child: ListBody(
            children: <Widget>[
              Text(content1),
              if (content2 != null) Text(content2),
            ],
          ),
        ),
        actions: <Widget>[
          TextButton(
            child: Text('confirm'),
            onPressed: () {
              if (onPressed != null) {
                onPressed(true);
              }
              Navigator.of(context).pop();
            },
          ),
          if (showCancel == true)
            TextButton(
              child: Text('cancel'),
              onPressed: () {
                if (onPressed != null) {
                  onPressed(false);
                }
                Navigator.of(context).pop();
              },
            ),
        ],
      );
    },
  );
}
