import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:say_what_file_password/constant.dart';
import 'package:say_what_file_password/func/long_dialog.dart';

class LongFilePicker extends StatefulWidget {
  final void Function(Uint8List)? onFilePicked;

  const LongFilePicker({Key? key, this.onFilePicked}) : super(key: key);

  @override
  _LongFilePickerState createState() => _LongFilePickerState();
}

class _LongFilePickerState extends State<LongFilePicker> {
  var _text = '';

  // final   Uint8List _only1 = Uint8List.fromList([1]);

  // Uint8List? _fileBytes = Uint8List.fromList([1]);
  Uint8List? _fileBytes;

  @override
  Widget build(BuildContext context) {
    // return Container(child: Text('bb z test'),);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(mainAxisSize: MainAxisSize.min, children: [
          ElevatedButton(onPressed: _onPicked, child: Text('file')),
          Container(
            width: 250,
            child: Text(_text.length > 0 ? _text : 'pick file please'),
          ),
          ElevatedButton(onPressed: _onSubmit, child: Text('Upload')),
        ]),
      ],
    );
  }

  Future<void> _onPicked() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['json'],
    );

    if (result != null && result.files[0].bytes != null) {
      _fileBytes = result.files[0].bytes!;

      setState(() {
        _text = result.files[0].name;
      });
    } else {
      _fileBytes = null;

      setState(() {
        _text = '';
      });
    }
  }

  void _onSubmit() {
    if (_fileBytes != null && widget.onFilePicked != null) {
      longDialog(context, onPressed: _onConfirm);
    }
  }

  void _onConfirm(bool isConfirm) {
    if (isConfirm) {
      widget.onFilePicked!(_fileBytes!);
    }
  }
//
// void _uploadFile() async {
//   final url = Uri.parse(DATA_SERVER_URL);
//
//   final request = http.MultipartRequest("POST", url);
//   request.fields['type'] = 'json';
//   // request.files.add( http.MultipartFile.fromBytes('datafile', await File.fromUri("<path/to/file>").readAsBytes(), contentType: new MediaType('image', 'jpeg')))
//   request.files.add(http.MultipartFile.fromBytes('datafile', _fileBytes));
//
//   request.send().then((response) {
//     if (response.statusCode == 200) print("Uploaded!");
//   });
// }
}
