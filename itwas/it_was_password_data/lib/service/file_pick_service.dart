import 'dart:typed_data';

import 'package:flutter/cupertino.dart';
import 'package:say_what_file_password/constant.dart';
import 'package:http/http.dart' as http;
import 'package:say_what_file_password/func/long_dialog.dart';

class FilePickerService {
  static final _filePickService = FilePickerService._internal();

  factory FilePickerService() {
    return _filePickService;
  }

  FilePickerService._internal();

  final _urlData = DATA_SERVER_URL + '/data';

  http.MultipartRequest request(Uint8List files, String password)  {
    final url = Uri.parse(_urlData);
    final request = http.MultipartRequest("POST", url);

    // request.fields['type'] = 'json';
    request.fields['password'] = password;
    // request.files.add( http.MultipartFile.fromBytes('datafile', await File.fromUri("<path/to/file>").readAsBytes(), contentType: new MediaType('image', 'jpeg')))
    request.files.add(http.MultipartFile.fromBytes('datafile', files, filename: 'data.json'));

    return request;
  }

  Future<void> send(BuildContext context, http.MultipartRequest request) async {
    final sending = await request.send();
    final s = await  sending.stream.bytesToString();

      if (s == '200'){
      longDialog(context, content1: 'success', showCancel: false);
    }else{
      longDialog(context, content1: 'failed', showCancel: false);
    }
  }
}
