import { FC, useCallback, useEffect, useState } from 'react';

import { Form, Input, Select } from 'antd';

const { Option } = Select;

interface ITranslateReqFormValue {
  TranslateRequest: string;
  TranslateDirection: string;
}

interface ITranslateReqForm {
  onSubmitForm: (translateDirection: string, translateRequest: string) => void;
  // disabled: boolean;
}

const TranslateReqForm: FC<ITranslateReqForm> = ({
  onSubmitForm,
  // disabled,
}) => {
  const [form] = Form.useForm();
  const [directTranslate, setDirectTranslate] = useState('EN-RU');

  const onFinish = useCallback(
    (values: ITranslateReqFormValue) => {
      onSubmitForm(values.TranslateDirection, values.TranslateRequest);
    },
    [onSubmitForm]
  );

  const handleChangeTranslateDirection = useCallback((value: string) => {
    setDirectTranslate(value);
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [directTranslate, onSubmitForm, form]);

  const prefixSelector = (
    <Form.Item name="TranslateDirection" noStyle>
      <Select style={{ width: 100 }} onChange={handleChangeTranslateDirection}>
        <Option value="EN-RU">{'EN->RU'}</Option>
        <Option value="RU-EN">{'RU->EN'}</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ width: '100%' }}
      initialValues={{ TranslateDirection: directTranslate }}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          form.submit();
        }
      }}
    >
      <Form.Item name="TranslateRequest">
        <Input
          placeholder="Введите слово ..."
          size="large"
          addonBefore={prefixSelector}
          // disabled={disabled}
          autoComplete="off"
        />
      </Form.Item>
    </Form>
  );
};

export default TranslateReqForm;
