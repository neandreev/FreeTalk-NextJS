import { FC, useCallback, useEffect, useState } from 'react';

import { Button, Form, Input, Select } from 'antd';

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
      <Select
        bordered={false}
        options={[
          {
            value: 'EN-RU',
            label: 'EN->RU',
          },
          {
            value: 'RU-EN',
            label: 'RU->EN',
          },
        ]}
        onChange={handleChangeTranslateDirection}
      />
    </Form.Item>
  );

  const submitButton = (
    <Form.Item name="TranslateDirection" noStyle>
      <Button size="small" type="link" htmlType="submit">
        Перевести
      </Button>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ width: '100%' }}
      initialValues={{ TranslateDirection: directTranslate }}
    >
      <Form.Item name="TranslateRequest">
        <Input
          placeholder="Введите слово ..."
          size="large"
          addonBefore={prefixSelector}
          addonAfter={submitButton}
          // disabled={disabled}
          autoComplete="off"
        />
      </Form.Item>
    </Form>
  );
};

export default TranslateReqForm;
