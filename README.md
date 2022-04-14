[![Aribi 로고](https://media.githubusercontent.com/media/clomia/Aribi/main/static/img/logo-mini.png)](https://clomia.aribi.community)
AWS 서버 비용 문제로 4월부터 서비스 중단하였습니다.
[clomia.aribi.community](https://clomia.aribi.community)  
=============
수많은 음식과 칵테일계의 인스타그램  
상상도 못한 레시피들이 당신을 기다리고 있습니다!  
  
집에 있는 재료로 어떤 음식을 만들 수 있을지 태그 검색을 통해서 한번에 찾아보세요!  
냉장고에 있는 재료들이 얼마나 많은 음식을 만들어낼 수 있는지 알면 놀라게 될걸요?!  
  
---
Python과 Django를 사용한 웹 서비스 개발 프로젝트입니다.  
  
웹뷰 방식으로 모바일 앱도 제작되었습니다.    
<p float="left">
    <img src="https://media.githubusercontent.com/media/clomia/Aribi/main/tools/readme/img/%EB%82%98%EB%A7%8C%EC%9D%98%20%EB%A0%88%EC%8B%9C%ED%94%BC%EB%A5%BC%20%ED%8F%AC%EC%8A%A4%ED%8C%85%ED%95%98%EC%84%B8%EC%9A%94.jpg" width="30%" height="30%"></img>
    <img src="https://media.githubusercontent.com/media/clomia/Aribi/main/tools/readme/img/%ED%83%9C%EA%B7%B8%20%EA%B2%80%EC%83%89%EC%9D%84%20%ED%86%B5%ED%95%B4%EC%84%9C%20%EC%9B%90%ED%95%98%EB%8A%94%20%EB%A0%88%EC%8B%9C%ED%94%BC%EB%A5%BC%20%EC%B0%BE%EC%95%84%EB%B3%B4%EC%84%B8%EC%9A%94.jpg" width="30%" height="30%"></img>
    <img src="https://media.githubusercontent.com/media/clomia/Aribi/main/tools/readme/img/%EA%B2%80%EC%83%89%EC%9D%84%20%ED%86%B5%ED%95%B4%EC%84%9C%20%EC%9B%90%ED%95%98%EB%8A%94%20%EC%A0%95%EB%B3%B4%EB%A5%BC%20%EC%B0%BE%EC%95%84%EB%B3%B4%EC%84%B8%EC%9A%94.jpg" width="30%" height="30%"></img>
</p>  
<p float="left">
    <img src="https://media.githubusercontent.com/media/clomia/Aribi/main/tools/readme/img/%EC%B7%A8%ED%96%A5%EC%97%90%20%EB%A7%9E%EB%8A%94%20%EB%A0%88%EC%8B%9C%ED%94%BC%EB%A5%BC%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%EC%97%90%20%EC%A0%80%EC%9E%A5%ED%95%98%EC%84%B8%EC%9A%94.jpg" width="30%" height="30%"></img>
    <img src="https://media.githubusercontent.com/media/clomia/Aribi/main/tools/readme/img/%EB%A7%88%EC%9D%8C%EA%BB%8F%20%EC%86%8C%ED%86%B5%ED%95%98%EC%84%B8%EC%9A%94!.jpg" width="30%" height="30%"></img>
</p>  
  
--- 

백엔드 로직은 Django Python 기반으로 작성되었습니다.  
프론트엔드는 Django Tamplate과 날것의 CSS/JavaScript로 작성되었습니다.    
개발 이외의 모든 디자인과 기획 또한 clomia 개인이 모두 진행하였습니다.  
SVG 제작을 포함한 각종 디자인에 사용된 툴은   
Adobe Illustrator, Adobe Photoshop입니다.  

## 배포
배포는 AWS를 통해서 진행하였습니다.  
  
사용된 주요 서비스    

* kakao Developers  
    * 카카오 로그인 구현  
* GitHub Developer settings  
    * 깃허브 로그인 구현  
* Sentry  
    * 서버 프로그렘에서 이슈가 발생하면 알려주도록 구현  
    * 코드에서 예외가 발생하면 내 이메일로 에러 로그와 각종 정보를 보내주도록 하였음  
* AWS
    * Elastic Beanstalk  
        * AWS에 환경을 구축하기 위해서 사용함  
        * 통합적으로 관리하는곳  
    * EC2  
        * 어플리케이션 서버 
        * ( 코드가 돌아가는 메인 서버 )
    * RDS  
        * 데이터베이스 서버 
        * DB는 PostgreSQL을 사용함
        * ( DB는 이곳으로 분리 후 EC2와 연결 )
    * S3  
        * Static 파일과 유저가 업로드 하는 파일을 저장하는 바구니
        * ( 파일 저장공간을 이곳으로 분리 후 EC2와 연결 )
    * Route 53  
        * DNS서버를 통해서 IP를 도메인에 연결  
        * 구매한 도메인은 .community 입니다.  
        * HTTPS에 사용한 레코드는 clomia입니다
        * 결과적으로 clomia.aribi.community 라는 URL을 만들었습니다.
    * Certificate Manager  
        * HTTPS 적용을 위한 인증서 발급  
* Google Search Console
    * 구글 검색 노출
* NAVER Search Advisor  
    * 네이버 검색 노출
* Swing2App  
    * 모바일 웹 뷰 앱 제작과 마켓 배포를 위해 사용한 서비스  
* Google Play Console  
    * 플레이스토어 배포를 위해서 개발자 계정 생성  
    * ( 앱스토어 배포는 Swing2App서비스의 배포 대행을 이용 )  
  
## 개발 기간  
[![wakatime](https://wakatime.com/badge/user/eaedfb05-2b60-4cd6-8436-6a673d9bd06f/project/bf7a6c21-4e6b-47d4-91a1-e8c1e81647a1.svg)](https://wakatime.com/badge/user/eaedfb05-2b60-4cd6-8436-6a673d9bd06f/project/bf7a6c21-4e6b-47d4-91a1-e8c1e81647a1)  
프로젝트의 아이디어는 2021년 7월 중순쯤 떠올랐습니다.  
7월 21일 첫 커밋을 하였습니다.
  
딥러닝 학습 일정으로 인해서 8월 9일부터 9월 15일까지는  
프로젝트에 손을 대지 못하였습니다.  
  
9월 15일 프로젝트를 재개하였으며  
10월 20일 배포를 완료하고 서비스 운영단계에 들어갔습니다.   
  
**요약: 개발기간은 ( 7/21 ~ 8/9 ) 그리고 ( 9/15 ~ 10/20 )입니다.**

## 디자인
투 컬러에서의 색 조합 - 어두운 색: #3b3b3b , 밝은 색: #fafafa  

### 태그의 컬러 시스템  
[HSV 컬러 모델](https://ko.wikipedia.org/wiki/HSV_%EC%83%89_%EA%B3%B5%EA%B0%84)을 사용해서 구현하였습니다.  
  
> H - 각도: 0 += 33 (0~360까지 33씩 더해가면서 총 11개의 색)    
> S - 채도: 37% 로 고정    
> V - 명도: 90% 로 고정 (단, H가 66일때는 86%)  
  
![](https://for-me.s3.ap-northeast-2.amazonaws.com/%EC%BB%AC%EB%9F%AC%EC%8B%9C%EC%8A%A4%ED%85%9C.jpg)  
가장 왼쪽에서 H값이 0입니다. 오른쪽 방향으로 한칸에 33씩 증가합니다.  

[ 액체, 재료, 용품, 과일맛, 식물맛, 기본맛, 향신료맛, 입안감촉, 향, 색감, 기타 특징 ]  
태그는 위와같이 11개 카테고리를 가집니다.  
모든 카테고리가 동일한 무개감을 가지면서도 서로 다른 느낌을 주어야 하며,  
**많은 종류의 색임에도 너무 알록달록하거나 현란한 느낌을 주어서는 안됩니다.**  
  
이렇게 고안한 방법을 통해서  
태그의 카테고리에 시각적 차이를 두면서 동시에  
전체와 쉽게 조화를 이룰 수 있도록 디자인하였습니다.  

## 기술  
Ajax 기술이 많이 사용되었습니다.  
핵심적인 Form을 제외하고는 거의 대부분 Ajax를 사용해서 서버와 통신합니다.  

여담.  
이번 프로젝트를 통해서 Ajax 기술을 처음 사용해보았습니다. 엄청 유용했습니다!    
[Clomia-Network](https://github.com/clomia/Clomia-Network) 프로젝트때 해보았던 저수준의 TCP 소켓 프로그래밍이나  
통신 프로토콜 구상 등의 경험이 큰 도움이 되었습니다.  
진작 남들이 만들어둔걸 사용해 볼껄 그랬네요...  

> 서비스 이용을 통해서 쉽게 알 수 있는 정보는 작성하지 않으려고 합니다.  
> 따라서 기술적인 내용은 더 없습니다.  
  
## 향후 계획  
  
> Aribi 서비스의 정채성은 편리한 레시피 검색 시스템에 있습니다.  
> 유저 수가 많아지고 포스팅이 늘어날수록  
> 필터링되는 정보가 많아지므로 서비스의 가치도 높아집니다.  
  
### 시작하게 된 계기  
칵테일 만들기를 좋아하는 친구가 있습니다.  
그렇게 저도 칵테일에 입문하게 되었습니다.  
얼마 뒤(2021/07/03) 친구들과 주류박람회에 가게 되었는데  
그때 처음으로 다채로운 술들을 여러 종류 사왔습니다.  

일단 끌려서 사오긴 했는데 사온 술들로 어떤 칵테일을 만들 수 있을지  
해볼 수 있는 레시피는 무엇이 있을지 찾아보기가 어려웠습니다.   
  
많은 정보가 유튜브에 있었습니다.  
바텐더같이 칵테일을 즐겨 만드는 사람들이  
유튜브에 자신들의 레시피를 소개하는 영상을 올립니다.  

하지만 영상매체에서 정보찾기란 쉽지 않았습니다.  
  
> **그냥 내가 가진 재료랑 내가 원하는 맛을 입력하는 것만으로도**    
> **당장 만들어 먹기 딱 좋은 레시피가 나온다면 얼마나 좋을까**  
  
음식 레시피 사이트는 있지만 대부분 식품회사의 마케팅과 이어졌고  
그게 아니더라도 디자인이 구리다거나, 유저들의 소통이 없었고  
아무리 좋은 서비스가 있다고 해도 결정적으로 칵테일 레시피를  
다루질 않아서 제가 하나 만들어야겠다고 생각하게 된 것입니다.  

### 그래서 향후 계획  
위에 작성된 계기를 통해서 눈치 채셨을 수도 있습니다.  
  
핵심 행동은 유튜브나 타 SNS에 레시피를 공유하는 주류업계 사람들을 끌어 모으는 것입니다.  
그들이 Aribi에서 본격적으로 활동하는것은 기대하기 어렵겠지만,  
포스팅을 만들고 그것을 유튜브나 다른 SNS에 링크 한줄로 공유할 수 있다는점에서는  
가능성이 있다고 생각됩니다.  
  
만만의 준비가 되었다고 생각되는 시점이 오면 이메일을 돌리는 등의 방법을 사용해서  
주류업계 인플루언서들에게 서비스를 소개해볼 예정입니다.  

평범한 마케팅 측면에서는 서비스 기획과 연관된 분야의 포럼을 타겟층으로 생각하고 있습니다.  
-- 예시 --
* 인스타에서 관련된 태그를 많이 사용하는 사람들  
* 주류갤러리 등의 포럼  
* 요리 컨텐츠를 다루는 사람들  
* 마지막으로 그냥 아무나 ( 인스타처럼 일상적인 포스팅과 소통도 가능하기 때문 )  

**많은 데이터가 쌓여서 사람들에게 유용한 레시피 검색 엔진이 되었으면 좋겠습니다.**  

----
  
## [clomia.aribi.community](https://clomia.aribi.community)    
![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/dd9bb2d9-2c2d-41f6-a32e-5ffbc80a42cf/%EA%B5%AC%EA%B8%80_%EA%B0%9C%EB%B0%9C%EC%9E%90_%ED%97%A4%EB%8D%94.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211020%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211020T132512Z&X-Amz-Expires=86400&X-Amz-Signature=6103d9ea3291f816c99d384b12b46054323ba556f2893b20a8853f07004cd73c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EA%25B5%25AC%25EA%25B8%2580%2520%25EA%25B0%259C%25EB%25B0%259C%25EC%259E%2590%2520%25ED%2597%25A4%25EB%258D%2594.jpg%22)  
