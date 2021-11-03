```json
{
    // ʹ�� IntelliSense �˽�������ԡ� 
    // ��ͣ�Բ鿴�������Ե�������
    // ���˽������Ϣ�������: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "��������",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "env":{
                "NODE_ENV":"development",
                "UNI_PLATFORM":"h5"
            },
            "args": ["uni-serve"],
            "program": "${file}"
        }
    ]
}
```