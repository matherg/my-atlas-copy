import { Container, Heading } from 'native-base';
import { Keyboard, SafeAreaView, Text, TouchableWithoutFeedback } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { useSignUp } from '../../contexts/SignUpContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NextButton from '../../components/NextButton';

const TransitionScreen = ({ route, navigation }) => {
  const { page, setPage, signUpState, setSignUpState, signUpFlow, handleChange } = useSignUp();

  const back = async () => {
    const prevPage = signUpFlow[page - 1];
    setPage(page - 1);
    // navigation.navigate(prevPage.page, {props: prevPage.props});
    navigation.pop();
  };

  const skip = async () => {
    const nextPage = signUpFlow[page + 1];
    setPage(page + 1);
    navigation.push(nextPage.page, { props: nextPage.props });
  };
  console.log(signUpState)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F1' }}>
        <Container h={'full'} w={'full'} maxWidth="100%" maxHeight="100%">
          <ProgressBar
            progress={20}
            hasSkip={false}
            hasProgress={true}
            backFunction={back}
            skipFunction={skip}></ProgressBar>
          <Heading
            size="3xl"
            marginTop={hp('5%')}
            marginBottom={hp('3%')}
            ml={wp('10%')}
            marginX={wp('10%')}>
            Hi {signUpState.name}!
          </Heading>
          <Heading
            size="3xl"
            marginTop={hp('5%')}
            marginBottom={hp('3%')}
            ml={wp('10%')}
            marginX={wp('10%')}>
            Nice to meet you.
          </Heading>
        </Container>
        <NextButton
          iconColor="#C55415"
          bgColor="#F1C3A9"
          pressedBgColor="#C55415"
          pressedIconColor="#FFFFFF"
          onPress={skip}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TransitionScreen;
