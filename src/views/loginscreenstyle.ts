import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Input = styled.TextInput`
  width: 100%;
  padding: 10px;
  margin-vertical: 10px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;